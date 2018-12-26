#!/usr/bin/env python3
import librosa
import sys
import numpy as np
from os import path, listdir
import json

def wav2json(wav, dtype='train'):
    x, _=librosa.load(wav, res_type='kaiser_fast', duration=3, offset=0.5)
    mx=librosa.feature.mfcc(y=x, n_mfcc=25)
    mfccs=np.mean(mx, axis=0)
    mfccs=[-(mfccs/100)]
    mfccs=mfccs[0].tolist()
    return json.dumps(mfccs)
print('Content-Type: application/json\n\n')
print(wav2json('./test.wav'))
