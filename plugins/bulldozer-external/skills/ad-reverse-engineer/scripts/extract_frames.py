#!/usr/bin/env python3
"""Extract key frames from a video ad for the 7-step analysis framework.

Usage:
    python extract_frames.py input_video.mp4 --output-dir frames/ --num-frames 12

Combines evenly-spaced sampling across the whole video with real scene-change
detection, so cuts aren't missed just because they fall between two evenly-spaced
indices. Frames are saved as JPEGs named by index, timestamp, and whether they were a
detected scene change, and a structure map on stdout labels the first frame as the hook
and the last as the CTA so they're easy to match back to the template.

Adapted from Creatify-AI/video-ad-reverse-engineer, MIT (c) Creatify AI.
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


def detect_scene_changes(video_path, threshold=30.0):
    """Return the frame indices where the picture changes enough to be a likely cut.

    Downscales every frame to 160x90 grayscale and flags an index when the mean
    absolute difference from the previous frame clears `threshold` (0-255 scale).
    Cheap on purpose — this only needs to be good enough to catch cuts, not to do
    real shot-boundary detection.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        sys.exit(f"Could not open video: {video_path}")

    changes = []
    prev_small = None
    idx = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        small = cv2.resize(gray, (160, 90))
        if prev_small is not None:
            diff = cv2.absdiff(small, prev_small).mean()
            if diff > threshold:
                changes.append(idx)
        prev_small = small
        idx += 1

    cap.release()
    return changes


def extract_frames(video_path, output_dir, num_frames=12, detect_scenes=True):
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
    evenly_spaced = {round(i * (frame_count - 1) / (num_frames - 1)) for i in range(num_frames)}

    scene_changes = set()
    if detect_scenes:
        scene_changes = set(detect_scene_changes(video_path))

    combined = sorted(evenly_spaced | scene_changes)

    # Scene detection on a long or noisy video can propose far more cuts than we want
    # frames: subsample back down rather than dumping every detected change to disk.
    if len(combined) > num_frames * 2:
        step = len(combined) / (num_frames * 2)
        combined = sorted({combined[round(i * step)] for i in range(num_frames * 2)})

    os.makedirs(output_dir, exist_ok=True)

    print(f"video: {video_path}")
    print(f"  duration: {duration:.1f}s · frames: {frame_count} · fps: {fps:.1f}")
    print(f"  {len(evenly_spaced)} evenly-spaced + {len(scene_changes)} scene change(s) "
          f"-> {len(combined)} frame(s) to {output_dir}")

    frame_map = []
    for idx in combined:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ok, frame = cap.read()
        if not ok:
            print(f"  warning: could not read frame {idx}, skipping", file=sys.stderr)
            continue

        # idx/fps assumes a constant frame rate; a variable-rate source (mobile
        # export, social re-encode — typical of an ad clip) makes fps an average
        # that can drift up to ~2s from the real position, worst right at a scene
        # cut. Reading the position the decoder actually landed on avoids that.
        timestamp = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000
        is_cut = idx in scene_changes
        suffix = "_cut" if is_cut else ""
        out_path = os.path.join(output_dir, f"frame_{idx:06d}_{timestamp:.2f}s{suffix}.jpg")
        Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).save(out_path, quality=95)
        frame_map.append((out_path, timestamp, is_cut))

    cap.release()

    print("\nad structure map:")
    for position, (path, timestamp, is_cut) in enumerate(frame_map):
        if position == 0:
            role = "hook"
        elif position == len(frame_map) - 1:
            role = "CTA"
        elif is_cut:
            role = "cut"
        else:
            role = "body"
        print(f"  [{role:>4}] {timestamp:6.2f}s  {path}")

    return frame_map


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("video", help="path to the input video file")
    parser.add_argument("--output-dir", default="frames/", help="directory to write frames to (default: frames/)")
    parser.add_argument("--num-frames", type=int, default=12, help="number of frames to extract (default: 12)")
    parser.add_argument("--no-scene-detect", action="store_true", help="disable scene-change detection, use evenly-spaced sampling only")
    args = parser.parse_args()

    extract_frames(args.video, args.output_dir, args.num_frames, detect_scenes=not args.no_scene_detect)


if __name__ == "__main__":
    main()
