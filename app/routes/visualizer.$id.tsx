import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { generate3DView } from "../../lib/ai.action";
import { Box, X, Download, Share2, RefreshCcw } from "lucide-react";
import Button from "../../components/ui/Button";



const VisualizerId = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { initialImage, initialRender, name } = location.state || {};

  const hasInitialGenerated = useRef(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(
    initialRender || null
  );

  const handleBack = () => {
    navigate("/");
  };

  const runGeneration = async () => {
    if (!initialImage) return;

    try {
      setIsProcessing(true);

      const result = await generate3DView({
        sourceImage: initialImage,
      });

      if (result?.renderedImage) {
        setCurrentImage(result.renderedImage);

        // Later you can update the saved project here
        // Example: await updateProject(...)
      }
    } catch (e) {
      console.error("Failed to generate 3D view", e);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!initialImage) return;
    if (hasInitialGenerated.current) return;

    hasInitialGenerated.current = true;

    if (initialRender) {
      setCurrentImage(initialRender);
      return;
    }

    runGeneration();
  }, [initialImage, initialRender]);

  return (
    
      <div className="visualizer">
        <nav className="topbar">
          <div className="brand">
              <Box className = "logo"/>
                    <span className='name'>Roomify</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleBack}
          className="exit"
          >
            <X className = "icon"/> Exit Editor

          </Button>
        </nav>

        <section className="content">
          <div className="panel">
              <div className="panel-header">
                  <div className="panel-meta">
                      <p>Project</p>
                      <h2>{"Untitled Project"}</h2>
                      <p className="note"> Created by you</p>
                  </div>
                  <div className="panel-actions">
                      <Button 
                          className="export"
                          size="sm" 
                          onClick={()=>{}} 
                          disabled={!currentImage}
                      >
                              <Download className="w-4 h-4 mr-2"/>Export
                        </Button>

                        <Button 
                          className="share"
                          size="sm" 
                          onClick={()=>{}} 
                          disabled={!currentImage}
                      >
                              <Share2 className="w-4 h-4 mr-2"/>Share
                        </Button>
                  </div>
              </div>
              <div className={`render-area ${isProcessing ? 'is-processing' : ''}`}>
                {currentImage ? (
                  <img src={currentImage} alt=" AI Render"  
                  className="render-img"/>
                ) : (
                      <div className="render-placeholder">
                            {initialImage && (
                              <img src={initialImage} alt="original"
                              className="render-fallback" />
                            )}

                            {isProcessing && (
                              <div className="render-overlay">
                                  <div className="rendering-card">
                                        <RefreshCcw className="spinner"/>
                                        <span className="title">Rendering ... </span>
                                        <span className="subtitle">Generating your 3D Visualization </span>
                                  </div>
                              </div>
                            )}
                      </div>
                  
                )}

              </div>
          </div>
        </section>  
      </div>
  );
};

export default VisualizerId;