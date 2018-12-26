#!/usr/bin/env python3
import librosa
import argv

if __name__ == '__main__':
    wav=argv[1]
    x, _=librosa.load(wav, res_type='keiser_fast', duration=3, offset=0.5)
    mfccs=np.mean(librosa.feature.mfcc(y=x, n_mfcc=25),axis=0)
    mfccs=[-(mfcss/100)]
    print(mfccs)
