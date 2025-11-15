import React from 'react';
import { Download, FileText } from 'lucide-react';

const ResourceCard = ({ icon, title, description, resources }) => {
  const handleDownload = (pdfPath, fileName) => {
    // Temporary: try PDF first, fall back to markdown for testing
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = fileName;
    link.target = '_blank'; // Open in new tab if PDF doesn't exist
    link.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
      {/* Header with icon and title */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-darkGrey mb-2">{title}</h3>
          <p className="text-darkGrey opacity-80 text-sm">{description}</p>
        </div>
      </div>

      {/* Resources list */}
      <div className="space-y-2 mt-4">
        {resources && resources.map((resource, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-platinum/50 rounded-md hover:bg-turquoise/10 transition-colors group"
          >
            <div className="flex items-center space-x-3 flex-1">
              <FileText size={18} className="text-turquoise" />
              <span className="text-sm font-medium text-darkGrey group-hover:text-turquoise transition-colors">
                {resource.name}
              </span>
            </div>
            <button
              onClick={() => handleDownload(resource.path, resource.fileName)}
              className="flex items-center space-x-1 px-3 py-1 bg-turquoise text-white rounded-md hover:bg-turquoise/80 transition-colors text-sm"
              aria-label={`Download ${resource.name}`}
            >
              <Download size={16} />
              <span>PDF</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceCard;
