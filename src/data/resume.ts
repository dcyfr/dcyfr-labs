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
  shortSummary: "Security architect and tinkerer with over five years of experience in information security, risk management, and incident response.",
  summary: "Cybersecurity professional with over five years of experience in information security, risk management, and incident response. My expertise covers various areas, including cloud security, vulnerability management, and security operations. I have successfully led security initiatives, conducted technical audits, and implemented robust security frameworks to safeguard organizational assets. With a strong foundation in both technical and leadership skills, I am dedicated to promoting a culture of security awareness and continuous improvement within teams and organizations.",
  experience: [
    {
      title: "Principal Security Engineer",
      company: "Monks",
      duration: "Jul 2023 → Present",
      responsibilities: [
        "Led technical audits to certify multiple sites for ISO 27001, SOC2, TISAX, and TPN",
        "Implemented technical controls that reduced global vulnerabilities by 23%",
        "Directed teams to reduce global incident response times by 35%"
      ]
    },
    {
      title: "Security Engineering Lead",
      company: "Monks (formerly Media.Monks)",
      duration: "Jul 2022 → Jul 2023",
      responsibilities: [
        "Created policies, procedures, and integration strategies for mergers and acquisitions",
        "Led threat hunting, security testing, and vulnerability management initiatives",
        "Established global security operations and incident response programs"
      ]
    },
    {
      title: "Information Security Engineer",
      company: "Monks (formerly MightyHive)",
      duration: "Jul 2021 → Jul 2022",
      responsibilities: [
        "Conducted audits and delivered findings, prioritizing future security initiatives",
        "Developed foundational global security operations and engineering programs",
        "Acted as a Subject Matter Expert reporting directly to the CISO"

      ]
    },
    {
      title: "Co-founder & Vice President",
      company: "Information Security Network, Inc",
      duration: "Sep 2019 → Sep 2021",
      responsibilities: [
        "Led virtual seminars, training, and events such as BSides and Hack Pensacola",
        "Promoted security awareness/education in collaboration with DC850",
        "Aligned IT and security objectives with nonprofit strategies"

      ]
    },
    {
      title: "Security Operations Analyst II",
      company: "Creative Breakthroughs, Inc",
      duration: "Dec 2020 → Jul 2021",
      responsibilities: [
        "Triaged and validated level one escalations, leading incident response for the SOC",
        "Assisted engineering teams with issue resolution and procedural enhancements",
        "Created playbooks and documentation tailored to client environments"
      ]
    },
    {
      title: "IT Security Specialist",
      company: "Escambia County Board of County Commissioners",
      duration: "Mar 2020 → Dec 2020",
      responsibilities: [
        "Implemented a security awareness program that improved phishing detection by 40%",
        "Triaged alerts, forensics, and incident response across 1k CJIS-certified systems",
        "Applied CIS and NIST controls to public and emergency support systems"

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
        "National Technical Honor Society Member",
        "Cyber Defense Club Training Officer & CTF Lead",
        "Computer Science & Mathematics Academic Scholar",
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
        "Leadership",
        "Communication",
        "Analytical Skills",
        "Collaboration",
        "Customer Service",
        "Problem Solving",
        "Critical Thinking",
        "Adaptability",
        "Time Management",
        "Project Management",
        "Mentoring & Training"
      ]
    },
    {
      category: "Security Knowledge",
      skills: [
        "Risk Management",
        "Vulnerability Management",
        "Incident Response",
        "Threat Hunting",
        "Security Operations",
        "Cloud Security",
        "Application Security",
        "Network Security",
        "Identity & Access Management",
        "Data Protection"
      ]
    },
    
    {
      category: "Frameworks & Standards",
      skills: [
        "NIST CSF",
        "SOC2",
        "ISO 27001",
        "ITIL",
        "STIGs",
        "OWASP",
        "NIST 800-53",
        "CCPA",
        "CIS Controls",
        "TISAX",
        "TPN",
        "CJIS",
        "LGPD",
        "GDPR",
      ]
    },
    {
      category: "Technologies & Tools",
      skills: [
        "AWS",
        "Cloudflare",
        "Snyk",
        "Google Cloud",
        "Claude",
        "CrowdStrike",
        "Visual Studio Code",
        "Tenable",
        "Vercel",
        "Qualys",
        "ChatGPT",
        "Zscaler",
        "MacOS",
        "Splunk",
        "Axiom",
        "Nessus",
        "Palo Alto",
        "Proofpoint",
        "VMware",
        "Wireshark",
        "Perplexity",
        "GitHub",
        "Carbon Black",
        "Burp Suite",
        "Google Gemini",
        "Metasploit",
        "Windows",
        "Google Workspace",
        "Postman",
        "Kali Linux",
        "Linux",
        "Bitbucket",
        "Microsoft Office 365",
        "Azure"
      ]
    },
    {
      category: "Programming & Automation",
      skills: [
        "Python",
        "Next.js",
        "Bash",
        "PowerShell",
        "Git",
        "Node.js",
        "CI/CD",
        "TypeScript",
        "Terraform",
        "YAML",
        "Docker",
        "Kubernetes",
        "REST API",
        "SQL",
        "Ansible",
        "React",
        "JavaScript",
        "JSON",
        "Go",
        "Java",
        "HTML/CSS",
        "C/C++",
        "PHP",
        "Lua",
      ]
    }
  ]
};

export default resume;
