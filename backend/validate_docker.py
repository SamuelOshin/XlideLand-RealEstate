#!/usr/bin/env python
"""
Docker setup validation script
Checks if Docker files are properly configured
"""
import os
import subprocess
from pathlib import Path

def check_file_exists(file_path, description):
    """Check if a file exists"""
    if os.path.exists(file_path):
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description}: {file_path} (NOT FOUND)")
        return False

def check_dockerfile_syntax():
    """Basic Dockerfile syntax check"""
    dockerfile_path = "Dockerfile"
    if not os.path.exists(dockerfile_path):
        print("❌ Dockerfile not found")
        return False
    
    with open(dockerfile_path, 'r') as f:
        content = f.read()
    
    required_instructions = ['FROM', 'WORKDIR', 'COPY', 'RUN', 'EXPOSE', 'CMD']
    missing = []
    
    for instruction in required_instructions:
        if instruction not in content:
            missing.append(instruction)
    
    if missing:
        print(f"❌ Dockerfile missing instructions: {', '.join(missing)}")
        return False
    else:
        print("✅ Dockerfile syntax looks good")
        return True

def check_docker_daemon():
    """Check if Docker daemon is running"""
    try:
        result = subprocess.run(
            ['docker', 'version'], 
            capture_output=True, 
            text=True, 
            timeout=10
        )
        if result.returncode == 0:
            print("✅ Docker daemon is running")
            return True
        else:
            print("❌ Docker daemon not responding")
            return False
    except (subprocess.TimeoutExpired, FileNotFoundError):
        print("❌ Docker not installed or not running")
        return False

def main():
    """Main validation function"""
    print("🐳 Docker Setup Validation")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists("manage.py"):
        print("❌ Please run this script from the backend directory")
        return
    
    # Check Docker files
    files_to_check = [
        ("Dockerfile", "Main Docker image definition"),
        ("docker-compose.yml", "Development compose file"),
        ("docker-compose.prod.yml", "Production compose file"),
        ("entrypoint.sh", "Container entrypoint script"),
        (".dockerignore", "Docker ignore file"),
        ("requirements.txt", "Python dependencies"),
    ]
    
    all_files_exist = True
    for file_path, description in files_to_check:
        if not check_file_exists(file_path, description):
            all_files_exist = False
    
    # Check Dockerfile syntax
    dockerfile_ok = check_dockerfile_syntax()
    
    # Check Docker daemon
    docker_running = check_docker_daemon()
    
    print("\n" + "=" * 40)
    print("📋 Summary:")
    
    if all_files_exist and dockerfile_ok:
        print("✅ Docker configuration is complete")
        
        if docker_running:
            print("✅ Ready to build Docker image!")
            print("\n🚀 Next steps:")
            print("  docker build -t xlideland-backend .")
            print("  docker-compose up --build")
        else:
            print("⚠️  Start Docker Desktop and try again")
            print("\n🚀 After starting Docker:")
            print("  docker build -t xlideland-backend .")
            print("  docker-compose up --build")
    else:
        print("❌ Docker configuration incomplete")
        print("Please check the missing files above")

if __name__ == '__main__':
    main()
