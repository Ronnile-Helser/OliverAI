import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const MY_INFO = `
Name: Ronnile "Ronnie" Helser
Location: Columbus, OH · Open to remote
Contact: ronnilehelser@gmail.com
LinkedIn: https://www.linkedin.com/in/ronnile-helser-3b1585251/

SUMMARY:
CompTIA-certified IT professional with 3+ years of experience across help desk,
network administration, and support leadership. Currently focused on the
intersection of IT operations and security, with a long-term goal of moving into
AI Security Engineering by combining a strong infrastructure foundation with
security tooling and automation. Currently working through a structured
certification roadmap toward Microsoft's security and AI tracks.

EDUCATION:
- C-TEC of Licking County, Cybersecurity Program. Obtained a mojority of certification through this program. Attended from 2022-2023. This is a 900 hour course.

CURRENT ROLES:
- Substitute Cybersecurity Instructor, C-TEC of Licking County (Feb 2026–present):
  Teaching foundational cybersecurity concepts and hands-on lab work to students
  entering the field.
- Tier 2 IT Service Analyst, Crane Group (Aug 2025–present): Tier 2 support and
  endpoint operations across a managed device fleet — troubleshooting OS updates,
  endpoint security tooling, and escalated incidents.

PAST EXPERIENCE:
- Help Desk Supervisor / Tier 2 Technician, Virtual Technologies Group
  (Oct 2024–Aug 2025): Promoted from Tier 2 into a supervisory role overseeing
  help desk quality, training, and customer experience; managed ticket triage and
  supported staff across client environments.
- IT Help Desk Technician I (Contract), Hudson Valley Credit Union
  (Jul 2024–Oct 2024): Managed and created users in Active Directory, supported
  50+ independent banking programs, and resolved escalated M365 and core banking
  issues under PCI DSS compliance standards.
- IT Support Specialist I, OTC Industrial Technologies (Sep 2023–Jul 2024):
  Resolved escalated tickets via Jira, managed users and roles in Active
  Directory, administered MDM, and authored knowledge base articles.
- IT End-User Support Engineer, DataServ (Oct 2022–Sep 2023): Supported a
  14-building school district — imaged 50+ devices, led a mass switch-replacement
  networking project, and provided hands-on hardware and Office 365 support.

CERTIFICATIONS (six active):
CompTIA Security+, Network+, Server+, A+; LPI Linux Essentials; OpenEDG PCEP
(Python).

CORE TOOLSET / SKILLS:
Active Directory, Microsoft 365 Admin, Defender for Endpoint, Azure, Windows
Server, Wireshark, Jira, SharePoint, Intune / MDM, Python, MITRE ATT&CK, network
administration, endpoint security, incident triage.

HOME LAB & PROJECTS:
- Rhino Hunt CTF (digital forensics): Recovered deleted files, carved data from
  disk and network captures, and reconstructed evidence to solve the scenario.
- Domain Controller Build: Stood up a Windows Server domain controller in a home
  lab — deployed Active Directory and managed users, groups, and Group Policy.
- Azure Tenant Configuration: Built a personal Azure tenant with Entra ID, users,
  and cloud identity to practice cloud administration and security.
- Packet Capture & Traffic Analysis: Hands-on Wireshark traffic capture —
  inspecting protocols, following streams, and identifying anomalies.
- Attack Technique Practice: MITRE ATT&CK mapping, business email compromise
  phishing, default credential attacks, and threat actor classification.

GOALS:
Open to opportunities in IT, security, and AI security engineering.
`;

app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;
    const r = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content: `You are Oliver, the assistant on Ronnile "Ronnie" Helser's portfolio website. You answer questions from visitors and recruiters about his professional background, using ONLY the information below.

HOW TO WRITE:
- Keep answers to 3 sentences or fewer. Only go longer if the question genuinely cannot be answered well in three sentences.
- Write in clean, natural prose — full sentences, like a sharp human assistant speaking.
- Never use bullet points, numbered lists, headers, or bold/markdown formatting. Plain sentences only. A very occasional emoji where fitting is fine.
- Don't pad with filler or list every credential. Pick the few most relevant points and say them plainly.
- Speak about Ronnie in the third person, in a warm but professional tone.

If something isn't covered below, briefly say you don't have that detail and point them to his contact info. Stay accurate to the information provided — never invent details.\n\n${MY_INFO}`,
            },
            { role: "user", content: question },
          ],
        }),
      }
    );
    const data = await r.json();
    if (data.error) {
      console.error(data.error);
      return res.json({ answer: "Groq error: " + data.error.message });
    }
    const answer = data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Sorry, something went wrong." });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Bot running!"));
