/**
 * Procedural scenario engine generating schema-compliant, consistent fictional detective cases
 * for local development and testing when GEMINI_API_KEY is not configured.
 */

export function generateLocalMystery({ premise, genre, difficulty, suspectCount, setting, tone }) {
  const count = Math.min(Math.max(suspectCount || 4, 3), 5);
  const location = setting || 'Metropolitan Research Complex, District 4';
  const incidentDate = new Date().toISOString().split('T')[0];

  // Suspect Archetypes
  const archetypePool = [
    {
      id: 'suspect_1',
      name: 'Dr. Evelyn Cross',
      role: 'Chief Archivist & Systems Specialist',
      background: 'Fifteen years at the institution. Passed over for the directorship twice. Maintains the primary digital access logs.',
      motive: 'Was facing an internal inquiry regarding unauthorized export of legacy research files.',
      alibi: 'Claims she was calibrating sensor arrays on Floor 3 during the incident window.',
      portraitAssetId: 'portrait_cross',
      publicFacts: ['Keycard logged entering Floor 3 at 20:45', 'Requested transfer to the Zurich branch last month'],
    },
    {
      id: 'suspect_2',
      name: 'Marcus Vance',
      role: 'Facilities Security Officer',
      background: 'Former military contractor who took over facility surveillance six months ago. Deeply in debt due to offshore trading.',
      motive: 'Offered an enormous sum by an anonymous broker to secure physical custody of the project cipher.',
      alibi: 'Claims he was conducting a perimeter inspection and dealing with a faulty exterior door sensor.',
      portraitAssetId: 'portrait_vance',
      publicFacts: ['Had master override keys for all inner magnetic locks', 'Turned off backup audio recording at 21:00 for "routine maintenance"'],
    },
    {
      id: 'suspect_3',
      name: 'Julian Chen',
      role: 'Senior Software Engineer',
      background: 'Lead architect of the automated vault protocol. Extremely protective of his intellectual property.',
      motive: 'Believed the director was planning to license his algorithmic work without proper attribution.',
      alibi: 'Claims he was in a video conference with international partners from his home office until 21:30.',
      portraitAssetId: 'portrait_chen',
      publicFacts: ['Authored the automated fail-safe script that triggered the blackout', 'Exchanged tense messages with the victim earlier that afternoon'],
    },
    {
      id: 'suspect_4',
      name: 'Sloan Sterling',
      role: 'Private Financial Auditor',
      background: 'Contracted three days ago to audit grant allocations and high-value physical assets.',
      motive: 'Discovered discrepancies that pointed directly to her own firm\'s compliance failure.',
      alibi: 'Claims she was reviewing paper ledgers in Conference Room B with the blinds closed.',
      portraitAssetId: 'portrait_sterling',
      publicFacts: ['Seen carrying a reinforced aluminum briefcase at 21:20', 'Her visitor badge was never returned to reception'],
    },
    {
      id: 'suspect_5',
      name: 'Dr. Aris Thorne',
      role: 'Visiting Forensic Specialist',
      background: 'External consultant brought in to verify biochemical safety protocols in the containment wing.',
      motive: 'Competitor firm offered tenure and lab funding in exchange for proprietary biological telemetry.',
      alibi: 'Claims he was logged into the sterilization chamber terminal running decontamination cycles.',
      portraitAssetId: 'portrait_thorne',
      publicFacts: ['Has specialized knowledge of sedative compounds', 'Was found near the west service stairwell after the alarm sounded'],
    }
  ];

  const suspects = archetypePool.slice(0, count);

  // Designate suspect_2 (Marcus Vance) or suspect_1 as canonical culprit based on difficulty
  const culprit = suspects[1] || suspects[0];

  const timeline = [
    {
      id: 'event_1',
      timestamp: `${incidentDate}T20:15:00Z`,
      description: 'The team concludes the evening briefing. The vault containing the confidential assets is locked and armed.',
      relatedSuspectIds: suspects.map(s => s.id),
      relatedEvidenceIds: ['evidence_access_log'],
      isConfirmed: true,
    },
    {
      id: 'event_2',
      timestamp: `${incidentDate}T20:45:00Z`,
      description: `${suspects[0].name} logs badge entry onto Floor 3 terminal.`,
      relatedSuspectIds: [suspects[0].id],
      relatedEvidenceIds: ['evidence_access_log'],
      isConfirmed: true,
    },
    {
      id: 'event_3',
      timestamp: `${incidentDate}T21:05:00Z`,
      description: 'Primary camera feed in Corridor B experiences a 6-minute loop artifact. Motion sensor fails to log.',
      relatedSuspectIds: [culprit.id],
      relatedEvidenceIds: ['evidence_cctv_b', 'evidence_tech_report'],
      isConfirmed: true,
    },
    {
      id: 'event_4',
      timestamp: `${incidentDate}T21:18:00Z`,
      description: 'The emergency alarm sounds. The security vault is found breached and the confidential case asset is missing.',
      relatedSuspectIds: suspects.map(s => s.id),
      relatedEvidenceIds: ['evidence_incident_report'],
      isConfirmed: true,
    },
    {
      id: 'event_5',
      timestamp: `${incidentDate}T21:30:00Z`,
      description: 'Investigators arrive on site. The building is placed on immediate lockdown.',
      relatedSuspectIds: [],
      relatedEvidenceIds: ['evidence_incident_report'],
      isConfirmed: true,
    }
  ];

  const evidence = [
    // 1. WhatsApp-style Chat Transcript
    {
      id: 'evidence_chat_1',
      type: 'chat',
      title: 'Recovered Messaging Thread: Internal Security',
      summary: `Encrypted mobile conversation recovered between ${culprit.name} and an unknown contact shortly before the alarm.`,
      content: {
        platform: 'SecureMessenger (Fictional Export)',
        channel: 'Private Direct Message',
        messages: [
          { sender: 'Unknown (Signal ID #992)', text: 'Is the corridor clear? We need the transfer confirmed before 21:15.', timestamp: '20:58' },
          { sender: culprit.name, text: 'Corridor B loop is running. Camera won\'t register until the maintenance cycle clears.', timestamp: '21:02' },
          { sender: culprit.name, text: 'The vault keycard override is active. Don\'t contact me on this channel again.', timestamp: '21:04' },
          { sender: 'Unknown (Signal ID #992)', text: 'Copy that. Courier is waiting by the south loading dock.', timestamp: '21:05' }
        ]
      },
      relatedSuspectIds: [culprit.id],
      timelineEventIds: ['event_3'],
      clueType: 'direct',
      importance: 'critical',
      sourceDescription: 'Digital forensics extraction from discarded burner device in the east stairwell dumpster.',
      eventTimestamp: `${incidentDate}T21:04:00Z`,
      fictional: true,
    },

    // 2. CCTV Surveillance Evidence
    {
      id: 'evidence_cctv_b',
      type: 'cctv',
      title: 'Surveillance Camera B-04 (Corridor Vault Access)',
      summary: 'Timestamped security recording showing camera freeze and silhouette movement.',
      content: {
        cameraName: 'CAM-B04 (Sub-Level 2)',
        location: `${location} - East Corridor`,
        recordingTimestamp: `${incidentDate}T21:00:00Z - 21:12:00Z`,
        status: 'Corrupted / Video Loop Detected',
        frames: [
          { time: '21:01:14', description: 'Corridor empty. Standard fluorescent lighting.' },
          { time: '21:05:02', description: 'Artifact glitch: timestamp pauses for 32 seconds while static line travels downward.' },
          { time: '21:07:44', description: 'Brief reflection in glass partition reveals high-visibility security jacket worn by authorized personnel.' },
          { time: '21:11:00', description: 'Normal feed resumes. Vault door indicator light shows unlocked state.' }
        ]
      },
      relatedSuspectIds: [culprit.id],
      timelineEventIds: ['event_3'],
      clueType: 'direct',
      importance: 'high',
      sourceDescription: 'Digital surveillance hard drive archive, Partition S2.',
      eventTimestamp: `${incidentDate}T21:05:00Z`,
      fictional: true,
    },

    // 3. Document: Electronic Access Log
    {
      id: 'evidence_access_log',
      type: 'document',
      title: 'Electronic Keycard Audit Log (08:00 - 22:00)',
      summary: 'Automated turnstile and door reader records for restricted research sectors.',
      content: {
        documentType: 'Security Audit Export',
        records: [
          { time: '20:15', badgeHolder: 'Evelyn Cross', door: 'Main Atrium -> Floor 3', status: 'GRANTED' },
          { time: '20:30', badgeHolder: 'Julian Chen', door: 'Main Atrium -> Exit West', status: 'GRANTED' },
          { time: '20:52', badgeHolder: 'Marcus Vance', door: 'Maintenance Sub-Level -> Vault Corridor', status: 'GRANTED' },
          { time: '21:04', badgeHolder: 'OVERRIDE CODE 77-B', door: 'Inner Vault Door', status: 'OVERRIDE USED' },
          { time: '21:16', badgeHolder: 'Sloan Sterling', door: 'Conference B -> East Exit', status: 'DENIED (LOCKED)' }
        ]
      },
      relatedSuspectIds: suspects.map(s => s.id),
      timelineEventIds: ['event_1', 'event_2', 'event_3'],
      clueType: 'circumstantial',
      importance: 'critical',
      sourceDescription: 'Central server room automated syslog file.',
      eventTimestamp: `${incidentDate}T21:16:00Z`,
      fictional: true,
    },

    // 4. Red Herring: Heated Resignation Email
    {
      id: 'evidence_red_herring_email',
      type: 'document',
      title: 'Confidential Resignation Email Draft',
      summary: `An aggressive email draft written by ${suspects[0].name} threatening to go to the press.`,
      content: {
        documentType: 'Email Draft',
        from: `${suspects[0].name.toLowerCase().replace(' ', '.')}@institute.internal`,
        to: 'Director Board',
        subject: 'UNACCEPTABLE: Patent Infringement and Immediate Resignation',
        body: 'If my work is reassigned to the commercial branch without my signature by midnight, I will personally ensure every piece of your documentation is made public. You will not silence my team.',
        timestamp: `${incidentDate}T19:42:00Z`
      },
      relatedSuspectIds: [suspects[0].id],
      timelineEventIds: [],
      clueType: 'red_herring',
      importance: 'medium',
      sourceDescription: 'Workstation 3 local draft folder.',
      eventTimestamp: `${incidentDate}T19:42:00Z`,
      fictional: true,
    },

    // 5. Technical Forensic Report
    {
      id: 'evidence_tech_report',
      type: 'document',
      title: 'Forensic Hardware Diagnostics Report',
      summary: 'Analysis of the physical lock cylinder and video switcher console.',
      content: {
        documentType: 'Forensic Analysis',
        findings: [
          'No forced entry on physical lock cylinder; electronic solenoid was opened using valid bypass credentials.',
          'Video switcher 04 had a miniature USB hardware looper plugged directly into the analog monitor input.',
          'Only the head of surveillance and authorized facility technicians have physical keys to the video switcher rack.'
        ]
      },
      relatedSuspectIds: [culprit.id],
      timelineEventIds: ['event_3'],
      clueType: 'direct',
      importance: 'critical',
      sourceDescription: 'Forensic Response Team Preliminary Summary.',
      eventTimestamp: `${incidentDate}T22:30:00Z`,
      fictional: true,
    },

    // 6. Witness Statement
    {
      id: 'evidence_witness_receptionist',
      type: 'witness_statement',
      title: 'Statement of Evening Desk Attendant (Maria Cole)',
      summary: 'Eyewitness testimony regarding movements in the main foyer between 20:30 and 21:30.',
      content: {
        witnessName: 'Maria Cole',
        witnessRole: 'Night Receptionist',
        statement: `I remember seeing ${suspects[0].name} heading upstairs around 20:45 with a thermos of coffee. Later, around 21:15, ${culprit.name} came by the front desk breathing heavily, asking if the fire marshals had called. I thought it was strange because the alarm hadn't even gone off yet!`
      },
      relatedSuspectIds: [suspects[0].id, culprit.id],
      timelineEventIds: ['event_2', 'event_4'],
      clueType: 'direct',
      importance: 'high',
      sourceDescription: 'Sworn on-site audio deposition transcript.',
      eventTimestamp: `${incidentDate}T22:00:00Z`,
      fictional: true,
    }
  ];

  // Canonical Solution
  const solution = {
    culpritId: culprit.id,
    motive: `${culprit.name} was heavily in debt and conspired with an external broker to steal the restricted confidential materials in exchange for a massive payout.`,
    method: `Leveraging authorized master access to the security switcher, ${culprit.name} installed a hardware loop on Camera CAM-B04 at 21:02, creating an artificial blackout. They then used master override code 77-B to open the vault door unrecorded.`,
    opportunity: `As the on-duty security official, ${culprit.name} had legitimate physical access to the video rack, knew the override credentials, and could move through restricted zones without arousing suspicion.`,
    timelineExplanation: `The digital access log places ${culprit.name} entering the maintenance corridor at 20:52. The recovered encrypted messages show them confirming the loop at 21:04, directly matching the 21:04 vault breach. Crucially, the night desk attendant testified that ${culprit.name} asked about the alarm before it even sounded.`,
    evidenceReasoning: [
      {
        evidenceId: 'evidence_chat_1',
        explanation: 'Recovered chat messages show the culprit coordinating the camera loop and vault override in real time with an outside buyer.',
      },
      {
        evidenceId: 'evidence_tech_report',
        explanation: 'Proves the breach required physical key access to the video switcher rack, which only the head of security possessed.',
      },
      {
        evidenceId: 'evidence_witness_receptionist',
        explanation: 'The attendant\'s testimony reveals the culprit had prior knowledge of the alarm before it triggered.',
      }
    ],
    redHerringExplanation: `The aggressive resignation email from ${suspects[0].name} seemed to point directly to them as an angry insider. However, the access logs and timestamps prove she was on Floor 3 during the entire incident window, and lacked the security rack key required to loop the surveillance feed.`
  };

  return {
    title: `The Mystery of ${location.split(',')[0]}`,
    premise,
    genre: genre || 'crime',
    difficulty: difficulty || 'medium',
    caseBrief: `On the evening of ${incidentDate}, an unexplained security breach occurred at ${location}. ${premise} Investigators have isolated ${suspects.length} key persons of interest. Review the recovered chats, technical logs, CCTV recordings, and alibis to identify the true perpetrator.`,
    incident: {
      description: premise,
      location,
      incidentTime: `${incidentDate}T21:04:00Z`,
    },
    suspects,
    timeline,
    evidence,
    solution,
    generationStatus: 'ready',
    schemaVersion: 1,
    promptVersion: 'local-engine-1.0',
  };
}
