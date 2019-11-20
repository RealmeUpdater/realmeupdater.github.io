#!/usr/bin/env python3
"""Realme Updater website pages generator"""

import yaml
from requests import get

NAMES = yaml.load(get('https://raw.githubusercontent.com/androidtrackers/realme-updates-tracker/'
                      'master/devices.yml').text, Loader=yaml.FullLoader)
REGIONS = yaml.load(get('https://raw.githubusercontent.com/androidtrackers/realme-updates-tracker/'
                        'master/regions.yml').text, Loader=yaml.FullLoader)
with open("../pages/downloads/latest.template", "r") as latest_template:
    LATEST_TEMPLATE = latest_template.read()
with open("../pages/archive/archive.template", "r") as archive_template:
    ARCHIVE_TEMPLATE = archive_template.read()
with open("../pages/downloads/region.template", "r") as region_template:
    REGION_TEMPLATE = region_template.read()


def generate_latest():
    """
    Generate latest downloads pages
    """
    for codename, name in NAMES.items():
        name = name.replace('realme', 'Realme')
        template = LATEST_TEMPLATE.replace('$device', name).replace('$codename', codename)
        with open(f"../pages/downloads/{codename}.md", "w") as output:
            output.write(template)


def generate_archive():
    """
    Generate archive downloads pages
    """
    for codename, name in NAMES.items():
        name = name.replace('realme', 'Realme')
        template = ARCHIVE_TEMPLATE.replace('$device', name).replace('$codename', codename)
        with open(f"../pages/archive/{codename}.md", "w") as output:
            output.write(template)


def generate_regions():
    """
    Generate available regions pages
    """
    for region in REGIONS:
        template = REGION_TEMPLATE.replace('$region', region)
        with open(f"../pages/downloads/{region}.md", "w") as output:
            output.write(template)


def main():
    """
    Realme Updater data generate script
    """
    generate_latest()
    generate_archive()
    generate_regions()


if __name__ == '__main__':
    main()
