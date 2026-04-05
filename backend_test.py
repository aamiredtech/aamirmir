#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import subprocess
import os

class CapabilityBuilderAPITester:
    def __init__(self, base_url="https://capability-builder-5.preview.emergentagent.com"):
        self.base_url = base_url
        self.session_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def log_result(self, test_name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            self.passed_tests.append(test_name)
            print(f"✅ {test_name} - PASSED")
        else:
            self.failed_tests.append({"test": test_name, "details": details})
            print(f"❌ {test_name} - FAILED: {details}")

    def run_api_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
            
        if self.session_token:
            test_headers['Authorization'] = f'Bearer {self.session_token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if not success:
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_result(name, success, details if not success else "")
            
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_result(name, False, f"Exception: {str(e)}")
            return False, {}

    def create_test_session(self):
        """Create a test session for admin endpoints"""
        print("\n🔧 Creating test session for admin endpoints...")
        
        try:
            # Create test user and session in MongoDB
            mongo_script = """
            use('test_database');
            var userId = 'test-user-' + Date.now();
            var sessionToken = 'test_session_' + Date.now();
            var expiresAt = new Date(Date.now() + 7*24*60*60*1000);
            
            db.users.insertOne({
              user_id: userId,
              email: 'test.admin.' + Date.now() + '@example.com',
              name: 'Test Admin User',
              picture: 'https://via.placeholder.com/150',
              created_at: new Date()
            });
            
            db.user_sessions.insertOne({
              user_id: userId,
              session_token: sessionToken,
              expires_at: expiresAt,
              created_at: new Date()
            });
            
            print('SESSION_TOKEN:' + sessionToken);
            print('USER_ID:' + userId);
            """
            
            result = subprocess.run(['mongosh', '--eval', mongo_script], 
                                  capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                output_lines = result.stdout.split('\n')
                for line in output_lines:
                    if line.startswith('SESSION_TOKEN:'):
                        self.session_token = line.split('SESSION_TOKEN:')[1].strip()
                        print(f"✅ Test session created: {self.session_token[:20]}...")
                        return True
                        
            print(f"❌ Failed to create test session: {result.stderr}")
            return False
            
        except Exception as e:
            print(f"❌ Exception creating test session: {str(e)}")
            return False

    def test_public_endpoints(self):
        """Test all public endpoints"""
        print("\n📋 Testing Public Endpoints...")
        
        # Test root endpoint
        self.run_api_test("Root API", "GET", "", 200)
        
        # Test content endpoints
        self.run_api_test("Get All Content", "GET", "content", 200)
        self.run_api_test("Get Hero Content", "GET", "content/hero", 200)
        self.run_api_test("Get About Content", "GET", "content/about", 200)
        self.run_api_test("Get Services Content", "GET", "content/services", 200)
        
        # Test blog endpoints
        self.run_api_test("Get Blog Posts", "GET", "blog", 200)
        self.run_api_test("Get Blog Posts (Published Only)", "GET", "blog?published_only=true", 200)
        
        # Test lead creation
        lead_data = {
            "name": "Test User",
            "email": f"test.{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com",
            "designation": "Test Manager",
            "need_help_with": "Business Strategy & Growth",
            "message": "This is a test lead submission",
            "lead_type": "book_call"
        }
        self.run_api_test("Create Lead", "POST", "leads", 200, lead_data)
        
        # Test newsletter subscription
        newsletter_data = {
            "email": f"newsletter.{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com"
        }
        self.run_api_test("Newsletter Subscribe", "POST", "newsletter", 200, newsletter_data)
        
        # Test duplicate newsletter subscription
        self.run_api_test("Newsletter Subscribe (Duplicate)", "POST", "newsletter", 200, newsletter_data)

    def test_admin_endpoints(self):
        """Test admin endpoints (requires authentication)"""
        print("\n🔐 Testing Admin Endpoints...")
        
        if not self.session_token:
            print("❌ No session token available, skipping admin tests")
            return
        
        # Test auth endpoints
        self.run_api_test("Get Current User", "GET", "auth/me", 200)
        
        # Test admin stats
        self.run_api_test("Get Admin Stats", "GET", "admin/stats", 200)
        
        # Test leads management
        self.run_api_test("Get All Leads", "GET", "leads", 200)
        
        # Test newsletter subscribers
        self.run_api_test("Get Newsletter Subscribers", "GET", "newsletter", 200)
        
        # Test blog management
        self.run_api_test("Get All Blog Posts (Admin)", "GET", "admin/blog", 200)
        
        # Test blog post creation
        blog_data = {
            "title": f"Test Blog Post {datetime.now().strftime('%Y%m%d%H%M%S')}",
            "content": "This is a test blog post content for API testing.",
            "excerpt": "Test excerpt for the blog post",
            "category": "Strategy",
            "tags": ["test", "api"],
            "published": True
        }
        success, response = self.run_api_test("Create Blog Post", "POST", "blog", 200, blog_data)
        
        if success and 'post_id' in response:
            post_id = response['post_id']
            
            # Test blog post update
            update_data = {
                "title": f"Updated Test Blog Post {datetime.now().strftime('%Y%m%d%H%M%S')}",
                "published": False
            }
            self.run_api_test("Update Blog Post", "PUT", f"blog/{post_id}", 200, update_data)
            
            # Test blog post deletion
            self.run_api_test("Delete Blog Post", "DELETE", f"blog/{post_id}", 200)
        
        # Test content management
        content_data = {
            "section": "test_section",
            "content": {"test": "data", "updated_at": datetime.now().isoformat()}
        }
        self.run_api_test("Update Site Content", "PUT", "content/test_section", 200, content_data)

    def test_error_cases(self):
        """Test error handling"""
        print("\n⚠️  Testing Error Cases...")
        
        # Test invalid endpoints
        self.run_api_test("Invalid Endpoint", "GET", "invalid/endpoint", 404)
        
        # Test invalid blog post
        self.run_api_test("Get Non-existent Blog Post", "GET", "blog/non-existent-slug", 404)
        
        # Test unauthorized admin access
        old_token = self.session_token
        self.session_token = None
        self.run_api_test("Unauthorized Admin Stats", "GET", "admin/stats", 401)
        self.session_token = old_token
        
        # Test invalid lead data
        invalid_lead = {"name": ""}  # Missing required email
        self.run_api_test("Invalid Lead Data", "POST", "leads", 422, invalid_lead)

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Capability Builder API Tests...")
        print(f"🎯 Testing against: {self.base_url}")
        
        # Test public endpoints first
        self.test_public_endpoints()
        
        # Create test session and test admin endpoints
        if self.create_test_session():
            self.test_admin_endpoints()
        else:
            print("⚠️  Skipping admin tests due to session creation failure")
        
        # Test error cases
        self.test_error_cases()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"   Total Tests: {self.tests_run}")
        print(f"   Passed: {self.tests_passed}")
        print(f"   Failed: {len(self.failed_tests)}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for failure in self.failed_tests:
                print(f"   • {failure['test']}: {failure['details']}")
        
        return len(self.failed_tests) == 0

def main():
    tester = CapabilityBuilderAPITester()
    success = tester.run_all_tests()
    
    # Save results for reporting
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "failed_tests": len(tester.failed_tests),
        "success_rate": (tester.tests_passed/tester.tests_run*100) if tester.tests_run > 0 else 0,
        "passed_test_names": tester.passed_tests,
        "failed_test_details": tester.failed_tests
    }
    
    with open('/app/test_reports/backend_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())