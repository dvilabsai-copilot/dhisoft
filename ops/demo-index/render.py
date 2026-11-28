"""Bundle local screenshot assets for the demo index's single-file publisher."""

import base64
from pathlib import Path
import re
import sys


def render(output: Path) -> None:
    source = Path(__file__).resolve().parent
    html = (source / "index.html").read_bytes()

    def embed(match: re.Match[bytes]) -> bytes:
        screenshot = source / "screenshots" / match[1].decode("ascii")
        encoded = base64.b64encode(screenshot.read_bytes())
        return b'src="data:image/webp;base64,' + encoded + b'"'

    html = re.sub(rb'src="screenshots/(bizdiary-[a-z-]+\.webp)"', embed, html)
    if len(html) > 128 * 1024:
        raise SystemExit("The rendered demo index exceeds the 128 KiB publisher limit.")
    output.write_bytes(html)


if __name__ == "__main__":
    render(Path(sys.argv[1]))
