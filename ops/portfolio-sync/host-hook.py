"""Hostinger deployment hook. Install this directory as root before enabling it."""

import json
import subprocess
from pathlib import Path


TOOLS = Path(__file__).resolve().parent
NODE = "/opt/node-v22.23.5-linux-x64/bin/node"
CMS_ENV = "/srv/dhisoft-live/cms/.env"


def export_portfolio(release):
    with subprocess.Popen(
        ["/usr/sbin/runuser", "-u", "dhisoft-live", "--", "/usr/bin/env", "-i",
         NODE, str(TOOLS / "export.cjs")],
        cwd=release, stdout=subprocess.PIPE,
    ) as command:
        data = command.stdout.read(128 * 1024 + 1)
        if len(data) > 128 * 1024:
            command.kill()
            raise ValueError("The release portfolio export exceeds 128 KiB")
        if command.wait() != 0:
            raise RuntimeError(f"Could not export the portfolio from {release.name}")
    return json.loads(data)


def sync_web_portfolio(previous, release):
    baseline = export_portfolio(previous)
    incoming = export_portfolio(release)
    if baseline == incoming:
        print("CMS portfolio sync: no Git portfolio changes", flush=True)
        return
    data = json.dumps({"previous": baseline, "incoming": incoming, "revision": release.name})
    subprocess.run(
        ["/usr/sbin/runuser", "-u", "dhisoft-live-cms", "--", "/usr/bin/env", "-i",
         NODE, "--env-file=" + CMS_ENV, str(TOOLS / "sync.cjs")],
        input=data.encode("utf-8"), check=True,
    )
