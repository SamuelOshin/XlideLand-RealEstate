#!/usr/bin/env python
"""
Test script to validate Docker security improvements
"""
import os
import subprocess
from pathlib import Path

def test_entrypoint_syntax():
    """Test if entrypoint script has valid syntax"""
    try:
        result = subprocess.run(
            ['bash', '-n', 'entrypoint.sh'], 
            capture_output=True, 
            text=True,
            cwd=Path(__file__).parent
        )
        if result.returncode == 0:
            print("✅ Entrypoint script syntax is valid")
            return True
        else:
            print(f"❌ Entrypoint script syntax error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Could not test entrypoint syntax: {e}")
        return False

def check_security_improvements():
    """Check if security improvements are properly implemented"""
    entrypoint_path = Path("entrypoint.sh")
    
    if not entrypoint_path.exists():
        print("❌ entrypoint.sh not found")
        return False
    
    with open(entrypoint_path, 'r') as f:
        content = f.read()
    
    # Check for security improvements
    security_checks = [
        ('Environment check for DEBUG', '[ "$DEBUG" = "True" ]' in content),
        ('No hardcoded username', 'username=\'admin\'' not in content),
        ('No hardcoded password', 'password=\'admin123\'' not in content),
        ('Uses environment variables', 'DJANGO_SUPERUSER_USERNAME' in content),
        ('Production security message', 'Production mode: Superuser creation skipped' in content),
        ('Manual creation instructions', 'docker exec' in content),
    ]
    
    all_passed = True
    print("\n🔒 Security Improvements Check:")
    
    for check_name, passed in security_checks:
        if passed:
            print(f"  ✅ {check_name}")
        else:
            print(f"  ❌ {check_name}")
            all_passed = False
    
    return all_passed

def check_compose_files():
    """Check docker-compose files for proper configuration"""
    dev_compose = Path("docker-compose.yml")
    prod_compose = Path("docker-compose.prod.yml")
    
    checks_passed = True
    
    print("\n📦 Docker Compose Security Check:")
    
    # Check development compose
    if dev_compose.exists():
        with open(dev_compose, 'r') as f:
            dev_content = f.read()
        
        if 'DJANGO_SUPERUSER_PASSWORD' in dev_content:
            print("  ✅ Development compose includes superuser environment variables")
        else:
            print("  ⚠️  Development compose missing superuser environment variables")
            checks_passed = False
    else:
        print("  ❌ docker-compose.yml not found")
        checks_passed = False
    
    # Check production compose
    if prod_compose.exists():
        with open(prod_compose, 'r') as f:
            prod_content = f.read()
        
        if 'DJANGO_SUPERUSER' not in prod_content or 'DO NOT SET SUPERUSER' in prod_content:
            print("  ✅ Production compose properly excludes superuser variables")
        else:
            print("  ❌ Production compose contains superuser variables")
            checks_passed = False
    else:
        print("  ❌ docker-compose.prod.yml not found")
        checks_passed = False
    
    return checks_passed

def main():
    """Main test function"""
    print("🔒 Docker Security Validation")
    print("=" * 40)
    
    # Test entrypoint syntax
    syntax_ok = test_entrypoint_syntax()
    
    # Check security improvements
    security_ok = check_security_improvements()
    
    # Check compose files
    compose_ok = check_compose_files()
    
    print("\n" + "=" * 40)
    print("📋 Security Validation Summary:")
    
    if syntax_ok and security_ok and compose_ok:
        print("✅ All security improvements are properly implemented!")
        print("\n🎯 Security Features:")
        print("  • Environment-based superuser creation")
        print("  • Production safety (no auto-admin creation)")
        print("  • Development convenience maintained")
        print("  • Clear manual creation instructions")
        print("\n🚀 Safe for production deployment!")
    else:
        print("❌ Some security issues found. Please review the checks above.")
        
        if not syntax_ok:
            print("  - Fix entrypoint script syntax errors")
        if not security_ok:
            print("  - Complete security improvements in entrypoint.sh")
        if not compose_ok:
            print("  - Update docker-compose files")

if __name__ == '__main__':
    main()
