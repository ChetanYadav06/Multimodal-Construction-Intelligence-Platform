# Streamlit App Entry Point
# Allows both 'app.py' and 'main.py' to be used interchangeably on Streamlit Cloud

import runpy
from pathlib import Path

if __name__ == "__main__":
    main_file = Path(__file__).resolve().parent / "main.py"
    runpy.run_path(str(main_file), run_name="__main__")
