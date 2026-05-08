import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import { ArrowRight,Layers,Clock,ArrowUpRight } from 'lucide-react';
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import Upload1 from "../../components/Upload1";
import { useNavigate, useOutletContext } from "react-router";
import { useState, useRef } from "react";
// import  type { timeStamp } from "console";
import {createProject} from "../../lib/puter.action";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
      const navigate = useNavigate();
      const [projects, setProjects] = useState<DesignItem[]>([]);
      const isCreatingProjectRef = useRef(false);

      const handleUploadComplete = async (base64Data: string) => {
        const newId = Date.now().toString();
        const name = `Residence ${newId}`;

        const newItem = {
          id: newId, name , sourceImage: base64Data, 
          renderedImage: undefined, 
          timestamp: Date.now(), 
        }
        const saved = await createProject({ item : newItem, visibility:'private'});
          if(!saved){
            console.error(`Failed to save project`)
            return false;
          } 

          setProjects((prev) => [newItem, ...prev]);

        navigate(`/visualizer/${newId}`,{
            state: { 
              initialImage: saved.sourceImage,
              initialRendered: saved.renderedImage|| null,
              name
             }
        });

        return true;
      }
  return(
   <div className="home">
    <Navbar/>
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Introducting Roomify 2.0</p>
        </div>
        <h1>Build Beautiful Spaces at the speed of thought with Roomify</h1>
        <p className="subtitle">
          Roomify is an AI-first design Environment that helps you visualize, render and ship Architectural projects faster than ever.
        </p>
        <div className="actions">
          <a href="#" className="cta"> Start Building
            <ArrowRight  className="icon"/>
          </a>
          <Button variant="outline" size-lg>
            Watch demo
          </Button>
        </div>
        <div id="upload" className="upload-shell">
          <div className="grid-overlay"/>
          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>
              <h3>Upload your floor plan</h3>
              <p>Supports JPG, PNG, formats up to 10 MB</p>
            </div>
            {/* <Upload /> */}
            <Upload onComplete={handleUploadComplete} />

          </div>
        </div>
      </section>
      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your latest work and shared community projects, all in one place.
              </p>
            </div>
          </div>
          <div className="projects-grid">
            {projects.map(({id, name, sourceImage, renderedImage, timestamp}) => (
              <div className="project-card group">
              <div className="preview">
                <img src={renderedImage || sourceImage}
                      alt="Project" />
                    <div className="badge">
                      <span>Community</span>
                    </div>
              </div>
              
              <div className="card-body">
                <div>
                  <h3>{name}</h3>
                  <div className="meta">
                    <Clock  size={13}/>
                    <span>{new Date(timestamp).toLocaleDateString()}</span>
                    <span>By JSM</span>
                  </div>
                </div>
                <div className="arrow">
                  <ArrowUpRight  size={18}/>

                </div>
              </div>
            </div>
            ))}
            

          </div>

        </div>

      </section>
    </div>
    )
}
