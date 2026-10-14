# HTML Skeleton

## HTML Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{REPORT_TITLE}}</title>
  <style>/* paste CSS template above */</style>
</head>
<body>

  <!-- COVER -->
  <div class="cover">
    <div class="cover-tag">Prepared for {{CLIENT_NAME}}</div>
    <div class="cover-bar"></div>
    <div class="cover-title">{{REPORT_TITLE}}</div>
    <div class="cover-subtitle">{{REPORT_SUBTITLE}}</div>
    <div class="cover-meta">{{DATE}} · Confidential</div>
  </div>

  <!-- TABLE OF CONTENTS (only add this page if the client expects a printed TOC — see Document Structure) -->
  <div class="section toc">
    <h1>Table of Contents</h1>
    <ul class="toc-list">
      <li><a class="toc-entry" href="#sec-summary">Executive Summary</a></li>
      <li><a class="toc-entry" href="#sec-1">{{SECTION_TITLE}}</a></li>
    </ul>
  </div>

  <!-- EXECUTIVE SUMMARY -->
  <div class="section" id="sec-summary">
    <h1>Executive Summary</h1>
    <ul class="exec-summary">
      <li>{{KEY_FINDING_1}}</li>
      <li>{{KEY_FINDING_2}}</li>
      <li>{{KEY_FINDING_3}}</li>
    </ul>
    <p>{{2-3 sentence context}}</p>
  </div>

  <!-- MAIN SECTIONS -->
  <div class="section" id="sec-1">
    <h1>{{SECTION_TITLE}}</h1>
    <!-- content, tables, callouts -->
  </div>

  <div class="confidential">
    Confidential — prepared exclusively for {{CLIENT_NAME}}. Do not distribute.
  </div>

</body>
</html>
```
