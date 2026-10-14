#!/usr/bin/env python3
"""Extract evenly-spaced key frames from a video ad for visual evaluation.

Usage:
    python extract_video.py input_video.mp4 --output-dir frames/ --num-frames 8

Always keeps the first frame (the hook) and the last frame (the CTA); the rest are
spread evenly across the video so the body is represented too. Frames are saved as
JPEGs named by index and timestamp, and a frame map on stdout labels first/middle/last
as hook/body/CTA so they're easy to match back to the rubric.

Adapted from Creatify-AI/ad-creative-evaluator, MIT (c) Creatify AI.
"""
import argparse
import os
import sys

try:
    import cv2
except ImportError:
    sys.exit("Missing dependency: opencv-python. Install with: pip install opencv-python")

try:
    from PIL import Image
except ImportError:
    sys.exit("Missing dependency: Pillow. Install with: pip install Pillow")


def extract_frames(video_path, output_dir, num_frames):
    if not os.path.isfile(video_path):
        sys.exit(f"Video file not found: {video_path}")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        sys.exit(f"Could not open video: {video_path}")

    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 0
    duration = frame_count / fps if fps else 0

    if frame_count <= 0:
        cap.release()
        sys.exit(f"Video reports no frames: {video_path}")

    num_frames = max(2, min(num_frames, frame_count))
    # Evenly spaced indices across the whole video, first and last frame always included.
    indices = sorted({round(i * (frame_count - 1) / (num_frames - 1)) for i in range(num_frames)})

    os.makedirs(output_dir, exist_ok=True)

    print(f"video: {video_path}")
    print(f"  duration: {duration:.1f}s · frames: {frame_count} · fps: {fps:.1f}")
    print(f"  extracting {len(indices)} frame(s) to {output_dir}")

    frame_map = []
    for position, idx in enumerate(indices):
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ok, frame = cap.read()
        if not ok:
            print(f"  warning: could not read frame {idx}, skipping", file=sys.stderr)
            continue

        # Read the actual decoded position, not idx/fps: fps is a single average over
        # the whole file, so on a variable-frame-rate source (common after a mobile
        # export or a social re-encode) idx/fps drifts from the real timestamp by up
        # to seconds — worst right at a scene cut, which is exactly what the hook/CTA
        # frames need to be timed against.
        timestamp = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000
        out_path = os.path.join(output_dir, f"frame_{idx:06d}_{timestamp:.2f}s.jpg")
        Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).save(out_path, quality=90)

        if position == 0:
            role = "hook"
        elif position == len(indices) - 1:
            role = "CTA"
        else:
            role = "body"
        frame_map.append((out_path, timestamp, role))

    cap.release()

    print("\nframe map:")
    for path, timestamp, role in frame_map:
        print(f"  [{role:>4}] {timestamp:6.2f}s  {path}")

    return frame_map


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("video", help="path to the input video file")
    parser.add_argument("--output-dir", default="frames/", help="directory to write frames to (default: frames/)")
    parser.add_argument("--num-frames", type=int, default=8, help="number of frames to extract (default: 8)")
    args = parser.parse_args()

    extract_frames(args.video, args.output_dir, args.num_frames)


if __name__ == "__main__":
    main()
