import subprocess
import os
ROOT=os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
V=os.path.join(ROOT,'public','gameplay','gameplay.mp4'); O=os.path.join(ROOT,'public','shots')
H=0.5
# id, src start, final duration (s), playbackRate
shots=[('s1',75.3,3.0,1),('s2',48.5,5.0,1),('s3a',85.6,2.0,1),('s3b',94.0,1.5,1),('s3c',126.0,1.5,1),
('s4a',61.0,2.5,1),('s4b',79.0,2.5,1),('s5a',132.6,2.5,1),('s5b',173.0,2.5,1),
('s6a',135.2,1.5,1),('s6b',150.3,1.0,1),('s6c',164.2,1.0,1),('s6d',213.9,1.0,1),('s6e',219.0,1.5,1),
('s7',179.0,5.0,1),('s8a',303.7,1.0,1),('s8b',204.6,1.0,1),('s8c',257.6,1.5,1),('s8d',385.5,2.5,1),('s9',15.3,5.0,0.6)]
for sid,st,d,r in shots:
    src=d*r
    a=st-H; t=src+2*H
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{a:.3f}','-i',V,'-t',f'{t:.3f}','-c:v','libx264','-preset','slow','-crf','14','-g','10','-bf','0','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-c:a','aac','-b:a','192k','-ar','48000',f'{O}/{sid}.mp4'],check=True)
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{a:.3f}','-i',V,'-t',f'{t:.3f}','-vf','crop=300:450:442:0,scale=216:324,gblur=sigma=10','-an','-c:v','libx264','-preset','medium','-crf','24','-g','10','-bf','0','-pix_fmt','yuv420p',f'{O}/{sid}_bg.mp4'],check=True)
    print(sid,'ok')
