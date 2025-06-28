import React from 'react';
import { X, MessageCircle, Mail, Phone, FileText } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
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
            <h2 className="text-xl font-bold text-gray-900">Help & Support</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <MessageCircle className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Live Chat</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <Mail className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Email Support</span>
            </button>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">support@muncho.app</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">+91 80 1234 5678</span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>

            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  How do I create my first campaign?
                </h4>
                <p className="text-sm text-gray-600">
                  Go to Template Library, choose a template or start from scratch, and follow the wizard to set up your campaign.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Why can't I use WhatsApp templates?
                </h4>
                <p className="text-sm text-gray-600">
                  You need to upload your brand's WhatsApp header in Settings to unlock carousel templates.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  How do I check my campaign performance?
                </h4>
                <p className="text-sm text-gray-600">
                  Switch to the Campaign Performance tab to view detailed analytics and metrics for all your campaigns.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Additional Resources</h3>
            <div className="space-y-2">
              <button className="flex items-center space-x-3 w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Campaign Best Practices Guide</span>
              </button>
              <button className="flex items-center space-x-3 w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">WhatsApp Setup Tutorial</span>
              </button>
              <button className="flex items-center space-x-3 w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Analytics & Reporting Guide</span>
              </button>
            </div>
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

export default SupportModal;