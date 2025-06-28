import React from 'react';
import { X, Mail, MessageCircle, FileText } from 'lucide-react';

interface LoginHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginHelpModal: React.FC<LoginHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Login Help</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Support */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>Contact Support</span>
            </h3>
            <p className="text-gray-600">
              Need help with your account? Our support team is here to help.
            </p>
            <a
              href="mailto:support@muncho.app"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <span>support@muncho.app</span>
            </a>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  I forgot my password. What should I do?
                </h4>
                <p className="text-sm text-gray-600">
                  Click the "Forgot Password?" link on the login page. We'll send you a secure link to reset your password.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  My account is temporarily locked. Why?
                </h4>
                <p className="text-sm text-gray-600">
                  For security, we temporarily lock accounts after 5 failed login attempts. Wait 15 minutes or reset your password to regain access.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  I'm not receiving login emails. What's wrong?
                </h4>
                <p className="text-sm text-gray-600">
                  Check your spam folder and ensure you're using the correct email address. Contact support if you still don't receive emails.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  How do I create a new account?
                </h4>
                <p className="text-sm text-gray-600">
                  Click "Create one here" on the login page to start the account creation process. You'll need a valid email address and business information.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Additional Resources</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Check our status page for any ongoing issues</li>
              <li>• Review our security best practices guide</li>
              <li>• Join our community forum for tips and tricks</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginHelpModal;