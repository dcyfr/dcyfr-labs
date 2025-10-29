export type Experience = {
  title: string;
  company: string;
  duration: string;
  responsibilities: string[];
};

export type Education = {
  degree: string;
  institution: string;
  duration?: string;
  highlights?: string[];
};

export type CertificationCategory = {
  provider: string;
  certifications: string[];
};

export type SkillCategory = {
  category: string;
  skills: string[];
};

export type Resume = {
  summary: string;
  shortSummary: string;
  experience: Experience[];
  education: Education[];
  certifications: CertificationCategory[];
  skills: SkillCategory[];
};

export const resume: Resume = {
  shortSummary: "Cybersecurity architect with over five years of experience leading organizations in enterprise risk management, operational security, and incident response.",
  summary: "I'm a cybersecurity architect with over five years of experience leading teams in risk management, information security, and incident response. My skills include application development, cloud security, vulnerability management, and automating security operations. I have built and led security programs, implemented frameworks, and delivered technical solutions at scale, with a focus on fostering security awareness and ongoing improvement.",
  experience: [
    {
      title: "Principal Security Engineer",
      company: "Monks",
      duration: "Jul 2023 → Present",
      responsibilities: [
        "Led technical audits to certify multiple sites for ISO 27001, SOC2, TISAX, and TPN, ensuring compliance and security standards.",
        "Implemented technical controls that successfully reduced global vulnerabilities by 23%, enhancing overall security posture.",
        "Directed teams to streamline incident response processes, achieving a 35% reduction in global response times."
      ]
    },
    {
      title: "Security Engineering & Operations Lead",
      company: "Monks (formerly Media.Monks)",
      duration: "Jul 2022 → Jul 2023",
      responsibilities: [
        "Developed comprehensive policies and procedures for mergers and acquisitions to enhance security integration.",
        "Spearheaded threat hunting and vulnerability management initiatives to address security risks proactively.",
        "Established global security operations and incident response programs to ensure swift and effective responses to incidents."

      ]
    },
    {
      title: "Information Security Engineer",
      company: "Monks (formerly MightyHive)",
      duration: "Jul 2021 → Jul 2022",
      responsibilities: [
        "Conducted comprehensive technical audits to identify vulnerabilities, prioritizing future security initiatives.",
        "Developed foundational global security operations and engineering programs to enhance organizational security posture.",
        "Served as a Subject Matter Expert, providing insights and recommendations directly to the CISO."

      ]
    },
    {
      title: "Co-founder & Vice President",
      company: "Information Security Network, Inc.",
      duration: "Sep 2019 → Sep 2021",
      responsibilities: [
        "Co-founded Information Security Network, focusing on aligning IT and security objectives with nonprofit strategies.",
        "Led virtual seminars and training events, including BSides and Hack Pensacola, to enhance community engagement.",
        "Collaborated with DC850 to promote security awareness and education initiatives."

      ]
    },
    {
      title: "Security Operations Analyst II",
      company: "Creative Breakthroughs, Inc.",
      duration: "Dec 2020 → Jul 2021",
      responsibilities: [
        "Triaged and validated level one escalations, leading incident response for over 20 contracts.",
        "Collaborated with engineering teams to resolve operational issues and enhance procedures.",
        "Developed tailored playbooks and documentation for diverse client environments."
      ]
    },
    {
      title: "IT Security Specialist",
      company: "Escambia County Commissioners Office",
      duration: "Mar 2020 → Dec 2020",
      responsibilities: [
        "Developed and implemented a comprehensive security awareness program, enhancing phishing detection by over 40%.",
        "Managed triage of alerts and conducted forensics and incident response for over 1k CJIS-certified systems.",
        "Applied CIS and NIST controls to bolster security for public and emergency support systems."

      ]
    }
  ],
  education: [
    {
      degree: "MS Information Security Engineering",
      institution: "SANS Technology Institute",
      duration: "Jan 2024 → Present",
      highlights: [
        "Defensible Security Architecture & Engineering",
        "Hacking Techniques & Incident Response",
        "IT Security Planning, Policy, & Leadership",
        "Security Essentials"
      ]
    },
    {
      degree: "BAS Cybersecurity",
      institution: "Pensacola State College",
      duration: "Dec 2020",
      highlights: [
        "Computer Science Academic Scholar",
        "Cyber Defense Club Training Officer",
        "Capture the Flag Competition Lead",
        "National Technical Honors Society",
        "Three-time National Cyber League Gold Bracket Finalist"
      ]
    }
  ],
  certifications: [
    {
      provider: "GIAC",
      certifications: ["GDSA", "GSTRT", "GCIH", "GSEC"]
    },
    {
      provider: "CompTIA",
      certifications: ["CSIE", "CSAE", "CNVP", "CNSP", "CSAP", "CSIS", "CIOS", "SecurityX", "PenTest+", "CySA+", "Security+", "Network+", "A+", "ITF+"]
    },
    {
      provider: "Mile2",
      certifications: ["C)ISSO", "C)PTE", "C)DRE", "C)DFE"]
    },
    {
      provider: "ISC2",
      certifications: ["Candidate"]
    }
  ],
  skills: [
    {
      category: "Critical Skills",
      skills: [
        "Leadership", "Communication", "Analytical Skills", "Collaboration", "Customer Service", "Problem Solving", "Critical Thinking", "Adaptability", "Time Management", "Project Management", "Mentoring & Training"
      ]
    },
    {
      category: "Security Knowledge",
      skills: [
        "Risk Management", "Vulnerability Management", "Incident Response", "Threat Hunting", "Security Operations", "Cloud Security", "Application Security", "Network Security", "Identity & Access Management", "Data Protection"
      ]
    },
    {
      category: "Frameworks & Standards",
      skills: [
        "NIST", "CSF", "SOC2", "ISO 27001", "ITIL", "LGPD", "STIGs", "OWASP", "NIST 800-53", "CCPA/CPA", "CIS Controls", "TISAX", "TPN", "CJIS", "GDPR"
      ]
    },
    {
      category: "Technologies & Tools",
      skills: [
        "AWS", "Cloudflare", "Snyk", "Google Cloud", "Claude", "CrowdStrike", "Visual Studio Code", "Tenable", "Vercel", "Qualys", "ChatGPT", "Zscaler", "macOS", "Splunk", "Axiom", "Nessus", "Palo Alto", "Proofpoint", "VMware", "Wireshark", "Perplexity", "GitHub", "Carbon Black", "Burp Suite", "Google Gemini", "Metasploit", "Windows", "Google Workspace", "Postman", "Kali Linux", "Linux", "Microsoft Office 365", "Azure"
      ]
    },
    {
      category: "Programming & Automation",
      skills: [
        "Python", "Next.js", "Bash", "PowerShell", "Git", "Node.js", "CI/CD", "TypeScript", "Terraform", "YAML", "Docker", "Kubernetes", "REST API", "SQL", "Ansible", "React", "JavaScript", "JSON", "Go", "Java", "HTML/CSS", "C/C++"
      ]
    }
  ]
};

export default resume;
