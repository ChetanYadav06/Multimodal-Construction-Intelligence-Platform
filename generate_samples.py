import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SAMPLE_DIR = Path("sample_data")
SAMPLE_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def generate_safety_sample():
    # 800x600 construction site with scaffolding, elevation deck, workers
    img = Image.new("RGB", (800, 600), color=(140, 175, 215)) # Sky
    draw = ImageDraw.Draw(img)
    
    # Ground / foundation slab
    draw.rectangle([0, 420, 800, 600], fill=(95, 100, 105)) # Concrete slab
    
    # Concrete structural building frame
    draw.rectangle([100, 150, 400, 420], fill=(160, 165, 170), outline=(60, 65, 70), width=4)
    draw.rectangle([150, 200, 240, 280], fill=(60, 75, 90)) # Window opening
    draw.rectangle([270, 200, 360, 280], fill=(60, 75, 90))
    draw.rectangle([150, 320, 240, 420], fill=(50, 55, 60)) # Doorway
    
    # Level 2 slab
    draw.rectangle([80, 280, 420, 305], fill=(120, 125, 130), outline=(40, 45, 50), width=3)
    
    # Scaffolding on right side
    for x in [450, 530, 610]:
        draw.line([(x, 100), (x, 480)], fill=(210, 190, 50), width=4) # Uprights
    for y in [160, 240, 320, 400, 480]:
        draw.line([(450, y), (610, y)], fill=(210, 190, 50), width=3) # Ledgers
        draw.rectangle([445, y-5, 615, y], fill=(180, 130, 80)) # Planks
    # Cross braces
    draw.line([(450, 160), (530, 240)], fill=(180, 160, 30), width=2)
    draw.line([(530, 160), (450, 240)], fill=(180, 160, 30), width=2)
    draw.line([(530, 240), (610, 320)], fill=(180, 160, 30), width=2)
    draw.line([(610, 240), (530, 320)], fill=(180, 160, 30), width=2)
    
    # Worker 1 on scaffolding (Wearing Yellow Hardhat, Orange Vest)
    draw.ellipse([515, 180, 535, 200], fill=(255, 220, 0)) # Hard hat
    draw.rectangle([518, 200, 532, 230], fill=(255, 100, 0)) # High vis vest
    draw.line([(520, 230), (520, 240)], fill=(30, 40, 60), width=3)
    draw.line([(530, 230), (530, 240)], fill=(30, 40, 60), width=3)
    
    # Worker 2 near unbarricaded edge (Missing harness - hazard indicator)
    draw.ellipse([210, 245, 230, 265], fill=(255, 255, 255)) # White helmet
    draw.rectangle([212, 265, 228, 290], fill=(255, 120, 0)) # Vest
    
    # Caution barrier tape at ground
    for x in range(0, 800, 30):
        draw.polygon([(x, 430), (x+15, 430), (x+25, 445), (x+10, 445)], fill=(250, 200, 20))
        draw.polygon([(x+15, 430), (x+30, 430), (x+40, 445), (x+25, 445)], fill=(20, 20, 20))
        
    # Text annotation
    draw.text((20, 20), "SITE SAFETY INSPECTION - ZONE 4B", fill=(20, 30, 40))
    draw.text((20, 40), "OSHA 1926 Compliance Surveillance Frame", fill=(50, 60, 70))
    
    p1 = SAMPLE_DIR / "sample_safety_site.jpg"
    p2 = UPLOAD_DIR / "sample_safety_site.jpg"
    img.save(p1, "JPEG")
    img.save(p2, "JPEG")
    print(f"Saved safety sample to {p1}")

def generate_crack_sample():
    # 800x600 concrete beam with diagonal shear crack
    img = Image.new("RGB", (800, 600), color=(185, 188, 192)) # Concrete surface
    draw = ImageDraw.Draw(img)
    
    # Concrete texture / aggregate spots
    for i in range(150):
        cx = (i * 37) % 780 + 10
        cy = (i * 59) % 580 + 10
        r = (i % 4) + 2
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(155, 158, 162))
        
    # Column support on left
    draw.rectangle([0, 0, 160, 600], fill=(140, 145, 150), outline=(80, 85, 90), width=4)
    # Beam horizontal border
    draw.line([(160, 120), (800, 120)], fill=(90, 95, 100), width=5)
    draw.line([(160, 480), (800, 480)], fill=(90, 95, 100), width=5)
    
    # Pronounced diagonal shear crack running at 45 degrees from support
    crack_points = [
        (165, 475), (210, 440), (235, 410), (280, 360), (315, 330),
        (340, 310), (390, 260), (430, 220), (460, 185), (510, 135), (540, 125)
    ]
    # Draw dark jagged crack
    for i in range(len(crack_points)-1):
        p1 = crack_points[i]
        p2 = crack_points[i+1]
        draw.line([p1, p2], fill=(25, 20, 20), width=5)
        # Branching micro-cracks
        if i in [2, 4, 6]:
            draw.line([p1, (p1[0] + 25, p1[1] + 15)], fill=(45, 40, 40), width=2)
            
    # Tell-tale optical monitoring gauge
    draw.rectangle([320, 290, 400, 330], fill=(240, 240, 240), outline=(30, 30, 30), width=2)
    draw.line([(360, 290), (360, 330)], fill=(220, 20, 20), width=2)
    draw.text((328, 305), "GAUGE-02", fill=(10, 10, 10))
    
    # Annotation
    draw.text((180, 40), "STRUCTURAL ELEMENT: RC BEAM-COLUMN JUNCTION", fill=(30, 35, 40))
    draw.text((180, 65), "DIAGONAL SHEAR CRACK PROPAGATION (~3.2mm)", fill=(160, 30, 30))
    
    p1 = SAMPLE_DIR / "sample_structural_crack.jpg"
    p2 = UPLOAD_DIR / "sample_structural_crack.jpg"
    img.save(p1, "JPEG")
    img.save(p2, "JPEG")
    print(f"Saved crack sample to {p1}")

def generate_property_sample():
    # 800x600 modern architecture / apartment building
    img = Image.new("RGB", (800, 600), color=(170, 205, 240))
    draw = ImageDraw.Draw(img)
    
    # Landscaped lawn
    draw.rectangle([0, 460, 800, 600], fill=(50, 130, 65))
    draw.rectangle([250, 460, 550, 600], fill=(70, 75, 80)) # Driveway
    
    # Modern luxury residential villa / apartment
    draw.rectangle([180, 180, 620, 460], fill=(235, 238, 240), outline=(50, 55, 60), width=3)
    # Wood accent cladding
    draw.rectangle([200, 200, 340, 440], fill=(160, 95, 45))
    for y in range(210, 440, 20):
        draw.line([(200, y), (340, y)], fill=(120, 65, 25), width=2)
        
    # Large floor-to-ceiling glass windows
    draw.rectangle([360, 210, 590, 310], fill=(120, 170, 210), outline=(40, 45, 50), width=3)
    draw.line([(475, 210), (475, 310)], fill=(40, 45, 50), width=2)
    
    # Ground floor sliding glass and entrance
    draw.rectangle([360, 340, 590, 460], fill=(100, 150, 190), outline=(40, 45, 50), width=3)
    draw.rectangle([450, 360, 500, 460], fill=(30, 35, 40)) # Door
    
    # Rooftop solar pergola
    draw.rectangle([160, 160, 640, 180], fill=(60, 65, 70))
    for x in range(180, 620, 40):
        draw.line([(x, 140), (x+15, 160)], fill=(30, 35, 40), width=3)
        
    draw.text((30, 30), "REAL ESTATE VALUATION ASSET: PARC RESIDENCES", fill=(20, 30, 40))
    draw.text((30, 55), "Class A Modern Residential Development (2,800 sq.ft)", fill=(50, 60, 70))
    
    p1 = SAMPLE_DIR / "sample_property.jpg"
    p2 = UPLOAD_DIR / "sample_property.jpg"
    img.save(p1, "JPEG")
    img.save(p2, "JPEG")
    print(f"Saved property sample to {p1}")

if __name__ == "__main__":
    generate_safety_sample()
    generate_crack_sample()
    generate_property_sample()

