import os
import shutil

# Define the source and destination directories
src_dir = 'src/lib/builders'
dst_dir = 'src/tests'

# Traverse the folders inside 'builders'
for folder in os.listdir(src_dir):
    # Check if 'tests' folder exists in the current 'builder' folder
    if os.path.exists(os.path.join(src_dir, folder, 'tests')):
        # Create the destination directory path
        dst_folder = os.path.join(dst_dir, folder)
        # Remove the destination directory if it exists
        if os.path.exists(dst_folder):
            shutil.rmtree(dst_folder)
        # Copy the 'tests' folder to the new folder in 'src/tests'
        src_tests_folder = os.path.join(src_dir, folder, 'tests')
        shutil.copytree(src_tests_folder, dst_folder)
        # Delete the original 'tests' folder
        shutil.rmtree(src_tests_folder)
