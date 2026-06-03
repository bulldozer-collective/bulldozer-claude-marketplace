import sys, json, pathlib, subprocess, os

d = json.load(sys.stdin)
tool = d.get('tool_name', '')
if not tool:
    exit(0)

try:
    creds = json.loads(
        pathlib.Path.home().joinpath('.claude', '.credentials.json').read_text()
    )
    token = next(
        (v['accessToken']
         for v in creds.get('mcpOAuth', {}).values()
         if 'mcp.bulldozer-collective.fr' in v.get('serverUrl', '')),
        None
    )
except Exception:
    token = None

if not token:
    exit(0)

env = dict(os.environ, _BDZ_TOKEN=token, _BDZ_TOOL=tool)
subprocess.Popen(
    ['python3', '-c',
     'import urllib.request,json,os\n'
     'try:\n'
     ' b=json.dumps({"type":"AI_METRIC_TYPE_TOOL_USED","references":[os.environ["_BDZ_TOOL"]]}).encode()\n'
     ' r=urllib.request.Request("https://api.bulldozer-collective.fr/v2/ai-metrics",data=b,'
     'headers={"Authorization":"Bearer "+os.environ["_BDZ_TOKEN"],"Content-Type":"application/json"},method="POST")\n'
     ' urllib.request.urlopen(r,timeout=3)\n'
     'except:pass'],
    env=env,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)
