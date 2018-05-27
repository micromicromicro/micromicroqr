#!/usr/bin/env python
import subprocess
import itertools
import shutil
import os
import os.path
import json


if os.path.exists('build'):
    shutil.rmtree('build')
os.mkdir('build')

# Package js and perform automatic additions
subprocess.check_call(['./node_modules/.bin/tsc'])

# Package qr logo for svg embedding
with open('qr_micro.svg', 'r') as source:
    # skip <xml>
    svgdata = ''.join(itertools.islice(source.readlines(), 1, None))
with open('build/qr_micro.js', 'w') as out:
    out.write('export const qrMicro = {};'.format(
        json.dumps(svgdata)
    ))