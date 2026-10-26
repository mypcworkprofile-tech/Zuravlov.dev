#!/usr/bin/env python3
"""Rebuild developer_portfolio.zip from the current project files."""
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent
ARCHIVE = ROOT.parent / "developer_portfolio.zip"


def main():
    with zipfile.ZipFile(ARCHIVE, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(ROOT.rglob("*")):
            if path.is_file() and path.name != ARCHIVE.name:
                archive.write(path, path.relative_to(ROOT.parent))
    print(f"Archive created: {ARCHIVE}")


if __name__ == "__main__":
    main()
