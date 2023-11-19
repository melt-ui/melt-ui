import os
import shutil

# Define your root directory
root_dir = 'src/docs/previews'

# Walk through the root directory
for dir_path, dir_names, file_names in os.walk(root_dir):
    for file_name in file_names:
        # Check if the file is tailwind.svelte or css.svelte
        if file_name in ['tailwind.svelte', 'css.svelte']:
            # Create the new directory path
            new_dir = os.path.join(dir_path, file_name.split('.')[0])
            # Create the new directory
            os.makedirs(new_dir, exist_ok=True)
            # Create the new file path
            new_file_path = os.path.join(new_dir, 'index.svelte')
            # Create the old file path
            old_file_path = os.path.join(dir_path, file_name)
            # Move and rename the file
            shutil.move(old_file_path, new_file_path)
