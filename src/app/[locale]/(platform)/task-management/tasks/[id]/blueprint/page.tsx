'use client'
import React, { useState, useEffect } from 'react';

interface WorkerConfig {
  x: number;
  y: number;
  rotation: number;
}

interface StepInputs {
  [key: string]: string;
}

const FurnitureCoatingBlueprint: React.FC = () => {
  const [stepInputs, setStepInputs] = useState<StepInputs>({});
  const [svgContent, setSvgContent] = useState<string>('');
  const [workerConfig, setWorkerConfig] = useState<Record<string, WorkerConfig>>({});
  const [availableSvgs] = useState<string[]>(['blueprint1.svg','blueprint2.svg']); // Add more SVG files here
  const [selectedSvg, setSelectedSvg] = useState<string>('blueprint2.svg');
  const [hideUnselected, setHideUnselected] = useState<boolean>(false);

  const stepOptions: string[] = [
    'Sanding',
    'Priming',
    'Base Coating',
    'Color Application',
    'Clear Coating',
    'Drying/Curing',
    'Quality Check',
    'Polishing',
    'Assembly',
    'Final Inspection'
  ];

  // Parse transform string to extract rotation
  const parseTransform = (transform: string): number => {
    if (!transform) return 0;
    
    const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
    if (rotateMatch) {
    const params = rotateMatch[1]?.split(',').map(p => parseFloat(p.trim())) || [];
      return params[0] || 0;
    }
    return 0;
  };

  // Extract worker configurations from SVG by finding elements with worker IDs
  const extractWorkerConfig = (svgText: string): { config: Record<string, WorkerConfig>, ids: string[] } => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    
    const extractedWorkers: Record<string, WorkerConfig> = {};
    const extractedIds: string[] = [];

    console.log('Full SVG content:', svgText);
    
    // Find all elements with data-cell-id attribute containing "worker-" 
    // (this is how draw.io stores the IDs)
    const allElements = svgDoc.querySelectorAll('[data-cell-id^="worker-"]');
    console.log('Found elements with data-cell-id:', allElements);
    
    // Also try to find by regular id attribute
    const regularIdElements = svgDoc.querySelectorAll('[id^="worker-"]');
    console.log('Found elements with regular id:', regularIdElements);
    
    // Combine both approaches
    const elementsToProcess = [...Array.from(allElements), ...Array.from(regularIdElements)];
    console.log('Total elements to process:', elementsToProcess);
    
    elementsToProcess.forEach((element) => {
      // Get worker ID from either data-cell-id or id attribute
      const workerId = element.getAttribute('data-cell-id') || element.id;
      console.log('Processing worker:', workerId);
      
      // Look for the actual shape element (rect, circle, etc.) within this worker element
      let shapeElement = element.querySelector('rect, circle, ellipse, polygon, path');
      
      // If the element itself is a shape, use it
      if (!shapeElement && (element.tagName === 'rect' || element.tagName === 'circle' || element.tagName === 'ellipse')) {
        shapeElement = element;
      }
      
      console.log('Shape element found:', shapeElement);
      
      if (shapeElement) {
        let x = 0, y = 0, width = 0, height = 0;
        
        // Get dimensions based on element type
        if (shapeElement.tagName === 'rect') {
          x = parseFloat(shapeElement.getAttribute('x') || '0');
          y = parseFloat(shapeElement.getAttribute('y') || '0');
          width = parseFloat(shapeElement.getAttribute('width') || '0');
          height = parseFloat(shapeElement.getAttribute('height') || '0');
        } else if (shapeElement.tagName === 'circle') {
          const cx = parseFloat(shapeElement.getAttribute('cx') || '0');
          const cy = parseFloat(shapeElement.getAttribute('cy') || '0');
          const r = parseFloat(shapeElement.getAttribute('r') || '0');
          x = cx - r;
          y = cy - r;
          width = r * 2;
          height = r * 2;
        }
        
        console.log(`Worker ${workerId} - x:${x}, y:${y}, w:${width}, h:${height}`);
        
        // Calculate center position
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        // Extract rotation from transform attribute (check both the element and its parent)
        const elementTransform = shapeElement.getAttribute('transform') || '';
        const parentTransform = element.getAttribute('transform') || '';
        const combinedTransform = elementTransform + ' ' + parentTransform;
        
        const rotation = parseTransform(combinedTransform);
        
        console.log(`Worker ${workerId} final position - centerX:${centerX}, centerY:${centerY}, rotation:${rotation}`);
        
        extractedWorkers[workerId] = {
          x: centerX,
          y: centerY,
          rotation: rotation,
        };
        extractedIds.push(workerId);
      }
    });

    // Sort IDs to ensure consistent ordering
    extractedIds.sort((a, b) => {
      const aNum = parseInt(a.replace('worker-', ''));
      const bNum = parseInt(b.replace('worker-', ''));
      return aNum - bNum;
    });

    console.log('Final worker config:', extractedWorkers);
    console.log('Final worker IDs:', extractedIds);

    return { config: extractedWorkers, ids: extractedIds };
  };

  // Load SVG and extract worker configurations
  const loadSvg = async (svgFileName: string): Promise<void> => {
    try {
      const response = await fetch(`/${svgFileName}`);
      const svgText = await response.text();
      setSvgContent(svgText);
      
      // Extract worker configurations dynamically by ID
      const { config, ids } = extractWorkerConfig(svgText);
      setWorkerConfig(config);
      
      // Initialize step inputs for all workers
      const initialInputs: StepInputs = {};
      ids.forEach(workerId => {
        initialInputs[workerId] = '';
      });
      setStepInputs(initialInputs);
      
    } catch (error) {
      console.error('Failed to load SVG:', error);
    }
  };

  // Load initial SVG
  useEffect(() => {
    loadSvg(selectedSvg);
  }, [selectedSvg]);

  // Update SVG with text inputs and handle visibility
  const updateSvgWithText = (): string => {
    if (!svgContent) return '';

    let updatedSvg = svgContent;
    
    // Remove existing text elements that were added by this component
    updatedSvg = updatedSvg.replace(/<text[^>]*data-worker-label="true"[^>]*>.*?<\/text>/g, '');
    
    // Handle hiding unselected workers by modifying their style
    if (hideUnselected) {
      Object.keys(workerConfig).forEach((workerId) => {
        const hasText = stepInputs[workerId] && stepInputs[workerId].trim() !== '';
        
        if (!hasText) {
          // Find and hide the worker group by adding style="display:none" or opacity="0"
          const workerGroupRegex = new RegExp(`(<g[^>]*data-cell-id="${workerId}"[^>]*)(>)`, 'g');
          updatedSvg = updatedSvg.replace(workerGroupRegex, '$1 style="opacity:0.2"$2');
        }
      });
    }
    
    // Add text elements for each worker with input
    Object.entries(stepInputs).forEach(([workerId, stepName]) => {
      if (stepName.trim() && workerConfig[workerId]) {
        const config = workerConfig[workerId];
        const textElement = `<text x="${config.x}" y="${config.y + 4}" fill="black" font-size="10" font-weight="bold" text-anchor="middle" transform="rotate(${config.rotation},${config.x},${config.y})" data-worker-label="true">${stepName}</text>`;
        
        // Insert before closing </svg> tag
        updatedSvg = updatedSvg.replace('</svg>', `${textElement}</svg>`);
      }
    });
    
    return updatedSvg;
  };

  const handleInputChange = (workerId: string, value: string): void => {
    setStepInputs(prev => ({
      ...prev,
      [workerId]: value
    }));
  };

  const clearAll = (): void => {
    const clearedInputs: StepInputs = {};
    Object.keys(stepInputs).forEach(workerId => {
      clearedInputs[workerId] = '';
    });
    setStepInputs(clearedInputs);
  };

  const toggleHideUnselected = (): void => {
    setHideUnselected(prev => !prev);
  };

  const handlePrint = (): void => {
    // Create a new window with only the blueprint content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const svgToFrint = updateSvgWithText();
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Furniture Coating Blueprint</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            .blueprint-container {
              text-align: center;
            }
            .blueprint-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .blueprint-svg {
              border: 1px solid #ccc;
              background: #f9f9f9;
            }
            @media print {
              body { margin: 0; }
              .blueprint-container { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="blueprint-container">
            <div class="blueprint-title">Furniture Coating Blueprint - ${selectedSvg}</div>
            <div class="blueprint-svg">${svgToFrint}</div>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Small delay to ensure content is loaded before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleSvgChange = (newSvg: string): void => {
    setSelectedSvg(newSvg);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Furniture Coating Blueprint System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block font-medium mb-2">Select Blueprint:</label>
            <select
              value={selectedSvg}
              onChange={(e) => handleSvgChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableSvgs.map(svg => (
                <option key={svg} value={svg}>{svg}</option>
              ))}
            </select>
          </div>

          <h2 className="text-xl font-semibold mb-4">Step Assignment</h2>
          <div className="space-y-4">
            {Object.keys(stepInputs).sort((a, b) => {
              const aNum = parseInt(a.replace('worker-', ''));
              const bNum = parseInt(b.replace('worker-', ''));
              return aNum - bNum;
            }).map((workerId) => (
              <div key={workerId} className="flex items-center space-x-4">
                <label className="w-20 font-medium capitalize">
                  {workerId.replace('-', ' ')}:
                </label>
                <select
                  value={stepInputs[workerId]}
                  onChange={(e) => handleInputChange(workerId, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Step</option>
                  {stepOptions.map(step => (
                    <option key={step} value={step}>{step}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
            
            <button
              onClick={toggleHideUnselected}
              className={`px-4 py-2 rounded transition-colors ${
                hideUnselected 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {hideUnselected ? 'Show All Workers' : 'Hide Unassigned Workers'}
            </button>
          </div>

          {/* Debug info */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
            <strong>Workers found:</strong> {Object.keys(workerConfig).length}
            <br />
            <strong>Worker IDs:</strong> {Object.keys(workerConfig).sort().join(', ')}
            <br />
            <strong>Worker positions:</strong>
            <ul className="mt-2">
              {Object.entries(workerConfig).map(([id, config]) => (
                <li key={id}>
                  {id}: x={config.x.toFixed(1)}, y={config.y.toFixed(1)}, rot={config.rotation}°
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Blueprint Display */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Blueprint Preview</h2>
          <div 
            className="border border-gray-300 rounded p-4 bg-gray-50 max-h-96 overflow-auto"
            dangerouslySetInnerHTML={{ __html: updateSvgWithText() }}
          />
          
          <button
            onClick={handlePrint}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Print/Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default FurnitureCoatingBlueprint;