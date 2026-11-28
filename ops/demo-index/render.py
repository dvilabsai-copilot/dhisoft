"""Render the demo index with immutable screenshot URLs."""

import hashlib
import re
import sys
from pathlib import Path


def render(output: Path) -> None:
    source = Path(__file__).resolve().parent
    html = (source / "index.html").read_bytes()
    assets = output.parent / "demo-screenshots"
    assets.mkdir(parents=True, exist_ok=True)

    def fingerprint(match: re.Match[bytes]) -> bytes:
        screenshot = source / "screenshots" / match[1].decode("ascii")
        content = screenshot.read_bytes()
        if len(content) > 128 * 1024 or content[:4] != b"RIFF" or content[8:12] != b"WEBP":
            raise SystemExit(f"{screenshot.name} must be a WebP image no larger than 128 KiB.")
        name = f"{hashlib.sha256(content).hexdigest()}.webp"
        (assets / name).write_bytes(content)
        return f'src="/demo-screenshots/{name}"'.encode("ascii")

    html = re.sub(rb'src="screenshots/([a-z-]+\.webp)"', fingerprint, html)
    if len(html) > 128 * 1024:
        raise SystemExit("The rendered demo index exceeds the 128 KiB publisher limit.")
    output.write_bytes(html)


if __name__ == "__main__":
    render(Path(sys.argv[1]))
