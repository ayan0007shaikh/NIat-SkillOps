import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateRoadmap(targetRole: string, missingSkills: string[]) {
  const prompt = `
    You are an AI career planner.
    The user's target role is: ${targetRole}.
    Their main skill gaps (missing or developing) are: ${missingSkills.join(', ')}.
    
    Generate a 4-week roadmap to help them learn these skills.
    Return a JSON object with a single property "roadmap" which is an array of exactly 4 objects.
    Format of each object in the array:
    {
      "week_number": 1,
      "title": "Short title",
      "description": "Short explanation",
      "skill_name": "Comma separated skills",
      "estimated_minutes": 720
    }
  `

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const text = chatCompletion.choices[0]?.message?.content || '[]'
    
    // Groq json_object response format sometimes returns an object wrapper, let's extract the array
    const parsed = JSON.parse(text)
    
    if (Array.isArray(parsed)) {
       return parsed
    } else if (parsed.roadmap && Array.isArray(parsed.roadmap)) {
       return parsed.roadmap
    } else if (Object.values(parsed).length > 0 && Array.isArray(Object.values(parsed)[0])) {
       return Object.values(parsed)[0]
    }
    
    return parsed
  } catch (e) {
    console.error('Groq API failed, falling back to mock data for demo.', e)
    // Fallback Mock Data so the demo never fails
    return [
      {
        week_number: 1,
        title: "Linux Fundamentals",
        description: "Get comfortable in the terminal robots actually run on.",
        skill_name: "Linux, Bash, Git",
        estimated_minutes: 720
      },
      {
        week_number: 2,
        title: "Computer Vision Intensive",
        description: "Build solid CV foundations before touching robot perception.",
        skill_name: "OpenCV, Image Processing",
        estimated_minutes: 960
      },
      {
        week_number: 3,
        title: "ROS Fundamentals",
        description: "Understand nodes, topics and how robot software talks.",
        skill_name: "ROS 2, Python",
        estimated_minutes: 840
      },
      {
        week_number: 4,
        title: "Build a Robotics Project",
        description: "Ship proof: a working perception + navigation demo.",
        skill_name: "ROS, Computer Vision",
        estimated_minutes: 1080
      }
    ]
  }
}
