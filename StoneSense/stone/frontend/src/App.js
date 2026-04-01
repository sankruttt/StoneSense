import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import './App.css';
import waterIcon from './components/water icon.svg';
import saltIcon from './components/salt icon.svg';
import walkIcon from './components/walk icon.svg';
import uploadIcon from './components/upload icon .svg';
import logoImage from './components/logo.png';

function App() {
  const { currentUser, userProfile, logout } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [showProfile, setShowProfile] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const [hospitalsLoading, setHospitalsLoading] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [tipIndex1, setTipIndex1] = useState(0);
  const [tipIndex2, setTipIndex2] = useState(1);
  const [tipIndex3, setTipIndex3] = useState(2);
  const [currentStoneIndex, setCurrentStoneIndex] = useState(0);

  // Use refs to track current tip indices for accurate comparisons
  const tipIndex1Ref = useRef(0);
  const tipIndex2Ref = useRef(1);

  const healthTips = [
    {
      title: 'Water is Your Best Friend!',
      text: 'Aim for 2–3 liters a day. Staying hydrated can lower kidney stone risk by almost 40%',
      icon: waterIcon,
      color: 'pink'
    },
    {
      title: 'Cut the Salt, Spare the Kidneys',
      text: 'Too much sodium makes stones form faster. Stick to <5g of salt daily (about a teaspoon)',
      icon: saltIcon,
      color: 'green'
    },
    {
      title: 'Move a Little..',
      text: '15–20 minutes of walking daily improves blood flow and reduces stone recurrence',
      icon: walkIcon,
      color: 'orange'
    },
    {
      title: 'Limit Oxalate-Rich Foods',
      text: 'Spinach, nuts, and chocolate are high in oxalates. Balance them with calcium-rich foods',
      icon: waterIcon,
      color: 'green'
    },
    {
      title: 'Get Enough Calcium',
      text: 'Dietary calcium can prevent stones. Aim for 1000-1200mg daily from food sources',
      icon: saltIcon,
      color: 'pink'
    },
    {
      title: 'Watch Your Protein Intake',
      text: 'Too much animal protein increases stone risk. Balance with plant-based proteins',
      icon: walkIcon,
      color: 'orange'
    },
    {
      title: 'Add Citrus to Your Diet',
      text: 'Lemons and oranges contain citrate, which helps prevent stone formation naturally',
      icon: waterIcon,
      color: 'pink'
    },
    {
      title: 'Maintain a Healthy Weight',
      text: 'Obesity increases stone risk. Even losing 5-10% of body weight makes a difference',
      icon: walkIcon,
      color: 'green'
    },
    {
      title: 'Limit Sugary Drinks',
      text: 'Sodas and sweetened beverages increase stone risk. Choose water or herbal teas instead',
      icon: saltIcon,
      color: 'orange'
    },
    {
      title: 'Monitor Vitamin C Intake',
      text: 'High-dose vitamin C supplements can increase oxalate. Stick to dietary sources',
      icon: waterIcon,
      color: 'green'
    },
    {
      title: 'Reduce Caffeine',
      text: 'Excess caffeine can lead to dehydration. Limit coffee and energy drinks',
      icon: saltIcon,
      color: 'pink'
    },
    {
      title: 'Eat More Fiber',
      text: 'High-fiber foods help reduce calcium and oxalate in urine, lowering stone risk',
      icon: walkIcon,
      color: 'orange'
    }
  ];

  // Update refs whenever state changes
  useEffect(() => {
    tipIndex1Ref.current = tipIndex1;
  }, [tipIndex1]);

  useEffect(() => {
    tipIndex2Ref.current = tipIndex2;
  }, [tipIndex2]);

  // Independent timers for each tip position with uniqueness check
  useEffect(() => {
    const interval1 = setInterval(() => {
      setTipIndex1((prevIndex1) => {
        let newIndex = (prevIndex1 + 1) % healthTips.length;
        let attempts = 0;
        const otherTipIndex = tipIndex2Ref.current;
        // Ensure new tip has different index AND different color from the other tip
        while ((newIndex === otherTipIndex || healthTips[newIndex].color === healthTips[otherTipIndex].color) && attempts < healthTips.length) {
          newIndex = (newIndex + 1) % healthTips.length;
          attempts++;
        }
        return newIndex;
      });
    }, 10000); // 10 seconds

    const interval2 = setInterval(() => {
      setTipIndex2((prevIndex2) => {
        let newIndex = (prevIndex2 + 1) % healthTips.length;
        let attempts = 0;
        const otherTipIndex = tipIndex1Ref.current;
        // Ensure new tip has different index AND different color from the other tip
        while ((newIndex === otherTipIndex || healthTips[newIndex].color === healthTips[otherTipIndex].color) && attempts < healthTips.length) {
          newIndex = (newIndex + 1) % healthTips.length;
          attempts++;
        }
        return newIndex;
      });
    }, 13000); // 13 seconds

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [healthTips.length]);

  // Reset stone index when results change
  useEffect(() => {
    if (results && results.stones && results.stones.length > 0) {
      setCurrentStoneIndex(0);
    }
  }, [results]);

  // Keyboard navigation for stones
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't handle arrow keys if user is in an input field or if profile is showing
      if (showProfile) return;
      
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (results && results.stones && results.stones.length > 1) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          setCurrentStoneIndex((prev) => (prev + 1) % results.stones.length);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          setCurrentStoneIndex((prev) => (prev - 1 + results.stones.length) % results.stones.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [results, showProfile]);

  const handleFindHospitals = () => {
    setShowHospitals(true);
    setHospitalsLoading(true);
    
    // Mock hospital data
    setTimeout(() => {
      const mockHospitals = [
        {
          name: "Nizam's Institute of Medical Sciences",
          vicinity: 'Punjagutta Market, Hyderabad',
          rating: 4.3,
          opening_hours: { open_now: true },
          place_id: '1',
          lat: 0,
          lng: 0
        },
        {
          name: 'Asian Institute of Nephrology and Urology',
          vicinity: 'Somajiguda, Hyderabad',
          rating: 4.3,
          opening_hours: { open_now: true },
          place_id: '2',
          lat: 0,
          lng: 0
        },
        {
          name: 'Khairatabad Clinic',
          vicinity: 'Khairatabad, Hyderabad',
          rating: 4.3,
          opening_hours: { open_now: true },
          place_id: '3',
          lat: 0,
          lng: 0
        },
        {
          name: 'Medicover Hospital',
          vicinity: 'Nanakramguda, Financial District',
          rating: 4.5,
          opening_hours: { open_now: true },
          place_id: '4',
          lat: 0,
          lng: 0
        },
        {
          name: 'Metro Community Hospital',
          vicinity: '654 Maple Boulevard, Southside',
          rating: 4.4,
          opening_hours: { open_now: true },
          place_id: '5',
          lat: 0,
          lng: 0
        },
        {
          name: 'CARE Hospitals',
          vicinity: 'Banjara Hills, Hyderabad',
          rating: 4.7,
          opening_hours: { open_now: true },
          place_id: '6',
          lat: 0,
          lng: 0
        }
      ];
      
      setNearbyHospitals(mockHospitals);
      setHospitalsLoading(false);
    }, 1000);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResults(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    if (!currentUser) {
      setError('Please log in to upload scans');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 50);

      const idToken = await currentUser.getIdToken();
      
      const response = await axios.post('/api/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${idToken}`
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Small delay to show 100% completion
      setTimeout(() => {
        setResults(response.data);
        setLoading(false);
        setUploadProgress(0);
      }, 300);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process image');
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDownloadPDF = async () => {
    if (!results) return;

    try {
      const idToken = await currentUser.getIdToken();
      
      const response = await axios.post('/api/generate-pdf', results, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `kidney_stone_report_${results.timestamp}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to generate PDF');
    }
  };

  const handleSendToWhatsApp = async () => {
    if (!results) return;
    
    if (!userProfile?.phoneNumber) {
      alert('Please add your WhatsApp number in your profile first!');
      return;
    }

    try {
      const idToken = await currentUser.getIdToken();
      
      const response = await axios.post('/api/send-whatsapp', 
        { results, phoneNumber: userProfile.phoneNumber },
        {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        }
      );

      if (response.data.success) {
        alert('PDF report sent to WhatsApp successfully!');
      }
    } catch (err) {
      console.error('Error sending to WhatsApp:', err);
      alert(err.response?.data?.error || 'Failed to send report to WhatsApp');
    }
  };

  const handleSendMessage = async (messageText = null) => {
    const messageToSend = messageText || chatInput.trim();
    if (!messageToSend || chatLoading) return;

    setChatInput('');
    
    const newMessages = [...chatMessages, { role: 'user', content: messageToSend }];
    setChatMessages(newMessages);
    setChatLoading(true);

    try {
      const idToken = await currentUser.getIdToken();
      
      const response = await axios.post('/api/chat', {
        message: messageToSend,
        scan_results: results,
        history: chatMessages
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.data.success) {
        setChatMessages([
          ...newMessages,
          { role: 'assistant', content: response.data.message }
        ]);
      } else {
        throw new Error(response.data.error || 'Chat failed');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages([
        ...newMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const formatMessage = (text) => {
    let formatted = text;
    
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    const lines = formatted.split('\n');
    let inList = false;
    let result = [];
    
    for (let line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        if (!inList) {
          result.push('<ul>');
          inList = true;
        }
        result.push(`<li>${trimmedLine.substring(2)}</li>`);
      } else if (trimmedLine.match(/^\d+\.\s/)) {
        if (!inList) {
          result.push('<ol>');
          inList = true;
        }
        result.push(`<li>${trimmedLine.replace(/^\d+\.\s/, '')}</li>`);
      } else {
        if (inList) {
          result.push(lines[result.length - 1].includes('<ol>') ? '</ol>' : '</ul>');
          inList = false;
        }
        if (trimmedLine) {
          result.push(line);
        }
      }
    }
    
    if (inList) {
      result.push('</ul>');
    }
    
    return result.join('\n');
  };

  if (!currentUser) {
    return authView === 'login' ? (
      <Login onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  if (showProfile) {
    return (
      <div className="app">
        <header className="header">
          <div className="header-logo">
            <img src={logoImage} alt="StoneSense Logo" className="header-logo-image" />
            <h1>StoneSense</h1>
          </div>
          <div className="user-menu">
            <button onClick={() => setShowProfile(false)} className="profile-button">
              Back to Scan
            </button>
          </div>
        </header>
        <Profile onLogout={logout} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">
          <img src={logoImage} alt="StoneSense Logo" className="header-logo-image" />
          <h1>StoneSense</h1>
        </div>
        <div className="user-menu">
          <button onClick={() => setShowProfile(true)} className="welcome-button">
            Welcome, {userProfile?.name || 'User'}
          </button>
          <button onClick={handleFindHospitals} className="hospitals-button">
            🏥 Kidney specialist Hospitals
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="home-layout">
          <div className="left-section">
            <div className="upload-section">
              <h2>Upload Kidney Stone Scan</h2>
              
              {!preview ? (
                <div className="upload-area">
                  <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="file-input"
                  />
                  <label htmlFor="file-input" className="file-label">
                    <div className="upload-icon">
                      <img src={uploadIcon} alt="Upload" />
                    </div>
                    <p>PNG or JPG (max 2MB)</p>
                    <div className="upload-button">
                      Select Image
                    </div>
                  </label>
                </div>
              ) : (
                <div className="preview-section">
                  <img src={preview} alt="Preview" className="preview-image" />
                  
                  {loading && (
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                          {uploadProgress}%
                        </div>
                      </div>
                      <div className="progress-text">Analyzing scan...</div>
                    </div>
                  )}
                  
                  <div className="action-buttons">
                    <button onClick={handleUpload} disabled={loading} className="analyze-button">
                      {loading ? 'Analyzing...' : 'Analyze Scan'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setPreview(null);
                        setResults(null);
                      }}
                      className="reset-button"
                    >
                      Upload New Image
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="right-section">
            <div className="health-tips">
              <div className={`tip-card tip-card-${healthTips[tipIndex1].color}`}>
                <div className="tip-content">
                  <h3>{healthTips[tipIndex1].title}</h3>
                  <p>{healthTips[tipIndex1].text}</p>
                </div>
                <div className="tip-icon">
                  <img src={healthTips[tipIndex1].icon} alt="Tip icon" />
                </div>
              </div>
              
              <div className={`tip-card tip-card-${healthTips[tipIndex2].color}`}>
                <div className="tip-content">
                  <h3>{healthTips[tipIndex2].title}</h3>
                  <p>{healthTips[tipIndex2].text}</p>
                </div>
                <div className="tip-icon">
                  <img src={healthTips[tipIndex2].icon} alt="Tip icon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {results && (
          <div className="results-section">
            <h2 className="detection-results-title">Detection Results</h2>
            
            <div className="results-layout">
              <div className="results-left">
                {results.num_stones === 0 ? (
                  <div className="annotated-image-container">
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: '40px',
                      textAlign: 'center',
                      width: '100%',
                      height: '100%'
                    }}>
                      <h3 style={{ 
                        color: '#2a3342', 
                        fontSize: '1.5rem', 
                        marginBottom: '20px',
                        wordWrap: 'break-word',
                        maxWidth: '90%'
                      }}>
                        ⚠️ No Stones Detected
                      </h3>
                      <p style={{ 
                        color: '#666', 
                        fontSize: '1.1rem', 
                        lineHeight: '1.6',
                        wordWrap: 'break-word',
                        maxWidth: '90%'
                      }}>
                        {results.severity_description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="annotated-image-container">
                      <img src={results.output_image} alt="Detected stones" />
                    </div>
                    
                    <div className="button-group">
                      <button onClick={handleDownloadPDF} className="download-button pdf-button">
                        📄 Download PDF Report
                      </button>
                      <button onClick={handleSendToWhatsApp} className="download-button whatsapp-button">
                        📱 Send to WhatsApp
                      </button>
                    </div>
                  </>
                )}
              </div>

              {results.stones && results.stones.length > 0 && results.stones[currentStoneIndex] && (
                <div className="results-right">
                  <div 
                    className="stone-summary-card"
                    onWheel={(e) => {
                      if (results.stones.length > 1) {
                        e.preventDefault();
                        const scrollThreshold = 10;
                        if (Math.abs(e.deltaY) > scrollThreshold) {
                          if (e.deltaY > 0) {
                            // Scroll down - go to next stone, wrap to first if at end
                            setCurrentStoneIndex((prev) => (prev + 1) % results.stones.length);
                          } else if (e.deltaY < 0) {
                            // Scroll up - go to previous stone, wrap to last if at beginning
                            setCurrentStoneIndex((prev) => (prev - 1 + results.stones.length) % results.stones.length);
                          }
                        }
                      }
                    }}
                  >
                    <h3 className="summary-title">Stone Summary</h3>
                    
                    <div className="summary-item">
                      <span key={currentStoneIndex} className="summary-label stone-number-pulse">Stone #{results.stones[currentStoneIndex].id}</span>
                      <span className="summary-checkbox">☑</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-severity">
                      <div className={`severity-indicator ${
                        results.stones[currentStoneIndex]?.diameter_px > 10 
                          ? 'severe' 
                          : results.stones[currentStoneIndex]?.diameter_px > 5 
                          ? 'normal' 
                          : 'mild'
                      }`}></div>
                      <div className="severity-text">
                        <strong>
                          {results.stones[currentStoneIndex]?.diameter_px > 10 
                            ? 'Severe' 
                            : results.stones[currentStoneIndex]?.diameter_px > 5 
                            ? 'Normal' 
                            : 'Mild'}
                        </strong> – {
                          results.stones[currentStoneIndex]?.diameter_px > 10 
                            ? 'Large stone detected, consult a specialist' 
                            : results.stones[currentStoneIndex]?.diameter_px > 5 
                            ? 'Medium stone, monitor regularly' 
                            : 'Small stone, manageable with fluids'
                        }
                      </div>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-details">
                      <div className="detail-row">
                        <span className="detail-label">Diameter</span>
                        <span className="detail-value">
                          {results.stones[currentStoneIndex]?.diameter_px || 'N/A'} px
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Size</span>
                        <span className="detail-value">
                          {results.stones[currentStoneIndex]?.width_px || 'N/A'} × {results.stones[currentStoneIndex]?.height_px || 'N/A'} px
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Prediction Confidence</span>
                        <span className="detail-value">
                          {results.stones[currentStoneIndex]?.confidence 
                            ? (results.stones[currentStoneIndex].confidence * 100).toFixed(1) 
                            : 'N/A'}%
                        </span>
                      </div>
                    </div>

                    <div className="summary-footer">
                      Your kidneys appear healthy overall. Small stones are detected, but no signs of swelling or serious damage are observed.
                    </div>

                    <div className="summary-divider"></div>

                    <div className="total-stones-summary">
                      <span className="total-stones-count">{results.num_stones}</span>
                      <span className="total-stones-label">Total Stones Detected</span>
                    </div>

                    {results.stones.length > 1 && (
                      <div className="stone-navigation">
                        <span className="nav-hint">Scroll to see more stones ({currentStoneIndex + 1}/{results.stones.length})</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <div className={`chatbot-container ${chatOpen ? 'open' : ''}`}>
        {!chatOpen ? (
          <button className="chat-toggle" onClick={() => setChatOpen(true)}>
            💬 Health Assistant
          </button>
        ) : (
          <div className="chat-window">
            <div className="chat-header">
              <h3>Health Assistant</h3>
              <button className="chat-close" onClick={() => setChatOpen(false)}>×</button>
            </div>
            
            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <div className="chat-welcome">
                  <p>👋 Hello! I'm your kidney health assistant.</p>
                  <p>Ask me anything about kidney stones, prevention, or your scan results.</p>
                  <div className="quick-suggestions">
                    <p className="suggestions-title">Quick questions:</p>
                    <button 
                      className="suggestion-btn" 
                      onClick={() => handleSendMessage('What causes kidney stones?')}
                    >
                      What causes kidney stones?
                    </button>
                    <button 
                      className="suggestion-btn" 
                      onClick={() => handleSendMessage('How can I prevent kidney stones?')}
                    >
                      How can I prevent kidney stones?
                    </button>
                    <button 
                      className="suggestion-btn" 
                      onClick={() => handleSendMessage('What foods should I avoid?')}
                    >
                      What foods should I avoid?
                    </button>
                    <button 
                      className="suggestion-btn" 
                      onClick={() => handleSendMessage('Explain my scan results')}
                    >
                      Explain my scan results
                    </button>
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.role}`}>
                    <div 
                      className="message-content"
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="chat-message assistant">
                  <div className="message-content typing">Thinking...</div>
                </div>
              )}
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about kidney health..."
                disabled={chatLoading}
              />
              <button onClick={handleSendMessage} disabled={chatLoading || !chatInput.trim()}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {showHospitals && (
        <div className="hospitals-modal">
          <div className="hospitals-modal-content">
            <div className="hospitals-modal-header">
              <h2>🏥 Hospitals Near You</h2>
              <button onClick={() => setShowHospitals(false)} className="close-modal">
                ✕
              </button>
            </div>
            <div className="hospitals-modal-body">
              {hospitalsLoading ? (
                <div className="loading">Finding nearby hospitals...</div>
              ) : nearbyHospitals.length > 0 ? (
                <div className="hospitals-list">
                  {nearbyHospitals.map((hospital, index) => (
                    <div key={index} className="hospital-card">
                      <h3>{hospital.name}</h3>
                      <p className="hospital-address">{hospital.vicinity}</p>
                      <div className="hospital-info">
                        {hospital.rating && (
                          <span className="hospital-rating">⭐ {hospital.rating}</span>
                        )}
                        {hospital.opening_hours && (
                          <span className={`hospital-status ${hospital.opening_hours.open_now ? 'open' : 'closed'}`}>
                            {hospital.opening_hours.open_now ? '🟢 Open' : '🔴 Closed'}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.vicinity)}`, '_blank')}
                        className="directions-button"
                      >
                        Get Directions
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hospitals found nearby. Please try again.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
