import os
import cv2
import numpy as np
import pandas as pd
import seaborn as sns
from tqdm import tqdm
from zipfile import ZipFile
import matplotlib.pyplot as plt
from PIL import Image
from ultralytics import YOLO

model_weights_path = '/Users/sankrut/Projects/kidneystone/NH04_SatSan/stone/runs/detect/train2/weights/best.pt'
stone_detection_model = YOLO(model_weights_path)
test_image_path = '/Users/sankrut/Projects/kidneystone/NH04_SatSan/stone/data/train/images/1-3-46-670589-33-1-63700700750059521800001-5070347181582747136_png_jpg.rf.1caafe96658dc8bfb7dfe174ef751da3.jpg'
img_arr = Image.open(test_image_path)
results = stone_detection_model.predict(source = img_arr, save = True)

h, w = results[0].orig_shape  # image shape


#diameter_prediction
for box in results[0].boxes:
    x1, y1, x2, y2 = box.xyxy[0]   # bounding box corners

    # Width and height of bounding box
    width  = (x2 - x1).item()
    height = (y2 - y1).item()

    # Approximate diameter of stone
    diameter = max(width, height)

    print(f"Stone detected at [{x1:.2f}, {y1:.2f}, {x2:.2f}, {y2:.2f}]")
    print(f"Width: {width:.2f} px, Height: {height:.2f} px")
    print(f"Estimated diameter: {diameter:.2f} px")

    pixel_to_mm = 0.5  # example scaling, depends on scan
    diameter_mm = diameter * pixel_to_mm
    print(f"Estimated diameter: {diameter_mm:.2f} mm")