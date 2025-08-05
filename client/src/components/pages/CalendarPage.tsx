import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Modal, 
  Badge, 
  Alert,
  Form
} from 'react-bootstrap';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaCoffee, 
  FaUpload, 
  FaEnvelopeOpen,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarCheck,
  FaCalendarDay
} from 'react-icons/fa';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  description: string;
  location: string;
  type: 'cafe' | 'class' | 'meeting' | 'exhibition' | 'general';
}

// ICS Parser utility
const parseICS = (icsContent: string): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const lines = icsContent.split('\n').map(line => line.trim());
  
  let currentEvent: any = null;
  let inEvent = false;
  
  for (let line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
    } else if (line === 'END:VEVENT' && inEvent) {
      if (currentEvent.summary && currentEvent.dtstart) {
        events.push({
          id: currentEvent.uid || Math.random().toString(36),
          title: currentEvent.summary,
          start: parseICSDate(currentEvent.dtstart),
          end: currentEvent.dtend ? parseICSDate(currentEvent.dtend) : undefined,
          description: currentEvent.description || '',
          location: currentEvent.location || '',
          type: inferEventType(currentEvent.summary)
        });
      }
      inEvent = false;
      currentEvent = null;
    } else if (inEvent && line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').replace(/\\n/g, '\n').replace(/\\,/g, ',');
      
      switch (key.split(';')[0]) {
        case 'SUMMARY':
          currentEvent.summary = value;
          break;
        case 'DTSTART':
          currentEvent.dtstart = value;
          break;
        case 'DTEND':
          currentEvent.dtend = value;
          break;
        case 'DESCRIPTION':
          currentEvent.description = value;
          break;
        case 'LOCATION':
          currentEvent.location = value;
          break;
        case 'UID':
          currentEvent.uid = value;
          break;
      }
    }
  }
  
  return events;
};

const parseICSDate = (dateStr: string): Date => {
  // Handle both DATE and DATETIME formats
  if (dateStr.length === 8) {
    // DATE format: YYYYMMDD
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    return new Date(year, month, day);
  } else if (dateStr.length >= 15) {
    // DATETIME format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const hour = parseInt(dateStr.substring(9, 11));
    const minute = parseInt(dateStr.substring(11, 13));
    const second = parseInt(dateStr.substring(13, 15));
    return new Date(year, month, day, hour, minute, second);
  }
  return new Date();
};

const inferEventType = (title: string): CalendarEvent['type'] => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('cafe') || titleLower.includes('coffee')) return 'cafe';
  if (titleLower.includes('class') || titleLower.includes('workshop') || titleLower.includes('youth')) return 'class';
  if (titleLower.includes('meeting') || titleLower.includes('board')) return 'meeting';
  if (titleLower.includes('exhibit') || titleLower.includes('show')) return 'exhibition';
  return 'general';
};

const NeedleworkCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | ''>('');

  // Sample events for Nellys Needlers
  useEffect(() => {
    const sampleEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Nellys Needlers Cafe',
        start: new Date(2025, 2, 15, 10, 0), // March 15, 2025
        end: new Date(2025, 2, 15, 16, 0),
        description: 'Join us for our annual spring cafe featuring local artisans, needlework displays, and delicious refreshments. A perfect opportunity to connect with fellow needlework enthusiasts.',
        location: 'Community Center Main Hall',
        type: 'cafe'
      },
      {
        id: '2',
        title: 'Youth Needlework Workshop - Week 1',
        start: new Date(2025, 7, 4, 9, 0), // August 4, 2025
        end: new Date(2025, 7, 8, 15, 0),
        description: 'Week-long intensive needlework class for youth ages 8-16. Learn basic stitches, embroidery techniques, and create your first masterpiece!',
        location: 'Nellys Needlers Studio',
        type: 'class'
      },
      {
        id: '3',
        title: 'Historical Embroidery Exhibition',
        start: new Date(2025, 8, 20, 10, 0), // September 20, 2025
        end: new Date(2025, 8, 20, 17, 0),
        description: 'Showcasing historical needlework pieces from the 18th and 19th centuries. Guest curator will present on textile preservation techniques.',
        location: 'Heritage Museum',
        type: 'exhibition'
      },
      {
        id: '4',
        title: 'Monthly Board Meeting',
        start: new Date(2025, 7, 15, 19, 0), // August 15, 2025
        end: new Date(2025, 7, 15, 21, 0),
        description: 'Monthly board meeting to discuss upcoming events and society business.',
        location: 'Conference Room A',
        type: 'meeting'
      }
    ];
    setEvents(sampleEvents);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.ics')) {
      setUploadStatus('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const icsContent = e.target?.result as string;
        const parsedEvents = parseICS(icsContent);
        
        if (parsedEvents.length > 0) {
          setEvents(prevEvents => [...prevEvents, ...parsedEvents]);
          setUploadStatus('success');
          setTimeout(() => {
            setShowUploadModal(false);
            setUploadStatus('');
          }, 2000);
        } else {
          setUploadStatus('error');
        }
      } catch (error) {
        console.error('Error parsing ICS file:', error);
        setUploadStatus('error');
      }
    };
    reader.readAsText(file);
  };

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'cafe': return <FaCoffee className="me-1" />;
      case 'class': return <FaUsers className="me-1" />;
      case 'exhibition': return <FaEnvelopeOpen className="me-1" />;
      case 'meeting': return <FaCalendarAlt className="me-1" />;
      default: return <FaCalendarAlt className="me-1" />;
    }
  };

  const getEventVariant = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'cafe': return 'warning';
      case 'class': return 'primary';
      case 'exhibition': return 'success';
      case 'meeting': return 'secondary';
      default: return 'info';
    }
  };

  const generateCalendarDays = (): Date[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const calendarDays = generateCalendarDays();
  const weeks = [];
  for (let i = 0; i < 6; i++) {
    weeks.push(calendarDays.slice(i * 7, (i + 1) * 7));
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <h2 className="mb-3">Nelly's Needlers Meetings & Events</h2>
            </div>
            <Button variant="outline-primary" onClick={() => setShowUploadModal(true)}>
              <FaUpload className="me-2" />
              Import ICS
            </Button>
          </div>
        </Col>
      </Row>

      {/* Calendar */}
      <Card>
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <Button 
              variant="light" 
              size="sm" 
              onClick={() => navigateMonth(-1)}
            >
              <FaChevronLeft />
            </Button>
            <h4 className="mb-0">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <Button 
              variant="light" 
              size="sm" 
              onClick={() => navigateMonth(1)}
            >
              <FaChevronRight />
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body className="p-0">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'auto repeat(6, 120px)',
            gap: '0'
          }}>
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div 
                key={day} 
                className="p-2 text-center fw-bold bg-light border-end border-bottom"
                style={{ borderRight: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6' }}
              >
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((date, index) => {
              const dayEvents = getEventsForDate(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={index} 
                  className={`p-2 border-end border-bottom ${!isCurrentMonth ? 'text-muted bg-light' : ''} ${isToday ? 'bg-info bg-opacity-10' : ''}`}
                  style={{ 
                    borderRight: '1px solid #dee2e6', 
                    borderBottom: '1px solid #dee2e6',
                    minHeight: '120px'
                  }}
                >
                  <div className="fw-bold mb-1">{date.getDate()}</div>
                  <div className="d-flex flex-column gap-1">
                    {dayEvents.map(event => (
                      <Badge 
                        key={event.id}
                        bg={getEventVariant(event.type)}
                        className="text-start text-truncate"
                        style={{ 
                          fontSize: '0.7rem', 
                          cursor: 'pointer',
                          maxWidth: '100%',
                          display: 'block'
                        }}
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowModal(true);
                        }}
                      >
                        {getEventIcon(event.type)}
                        <span className="text-truncate">{event.title}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {/* Event Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            {selectedEvent && getEventIcon(selectedEvent.type)}
            {selectedEvent?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaCalendarAlt className="me-2 text-muted" />
                  <strong>Date:</strong>
                  <span className="ms-2">{formatDate(selectedEvent.start)}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FaClock className="me-2 text-muted" />
                  <strong>Time:</strong>
                  <span className="ms-2">
                    {formatTime(selectedEvent.start)}
                    {selectedEvent.end && ` - ${formatTime(selectedEvent.end)}`}
                  </span>
                </div>
                {selectedEvent.location && (
                  <div className="d-flex align-items-center mb-2">
                    <FaMapMarkerAlt className="me-2 text-muted" />
                    <strong>Location:</strong>
                    <span className="ms-2">{selectedEvent.location}</span>
                  </div>
                )}
              </div>
              {selectedEvent.description && (
                <div>
                  <strong>Description:</strong>
                  <p className="mt-2">{selectedEvent.description}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Import ICS Calendar File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Upload an ICS calendar file to import events into the Nellys Needlers calendar.</p>
          
          {uploadStatus === 'success' && (
            <Alert variant="success">
              <FaEnvelopeOpen className="me-2" />
              Events imported successfully!
            </Alert>
          )}
          
          {uploadStatus === 'error' && (
            <Alert variant="danger">
              Error importing file. Please ensure it's a valid ICS file.
            </Alert>
          )}
          
          <Form.Control
            type="file"
            accept=".ics"
            onChange={handleFileUpload}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NeedleworkCalendar;