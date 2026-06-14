const fs = require("fs");

const events = JSON.parse(
fs.readFileSync("events.json", "utf8")
);

const CATEGORY_RULES = {
"Artificial Intelligence": {
keywords: [
"artificial intelligence",
"machine learning",
"deep learning",
"edge ai",
"transformer",
"transformers",
"neural network",
"computer vision",
"predictive modelling",
"predictive modeling",
"ai-driven"
],
skills: [
"Machine Learning",
"Deep Learning",
"AI",
"Data Analysis"
]
},

"Cybersecurity": {
    keywords: [
        "security",
        "forensics",
        "incident response",
        "cyber",
        "secure"
    ],
    skills: [
        "Cybersecurity",
        "Digital Forensics",
        "Incident Response"
    ]
},

"Quantum Computing": {
    keywords: [
        "quantum"
    ],
    skills: [
        "Quantum Computing",
        "Quantum Machine Learning"
    ]
},

"Research": {
    keywords: [
        "conference",
        "research",
        "methodology",
        "scholarly"
    ],
    skills: [
        "Research",
        "Academic Writing",
        "Publication"
    ]
},

"Networking": {
    keywords: [
        "ethernet",
        "can",
        "lin",
        "wireless",
        "5g",
        "communication"
    ],
    skills: [
        "Networking",
        "Wireless Systems",
        "Communication Systems"
    ]
},

"Embedded Systems": {
    keywords: [
        "fpga",
        "risc-v",
        "iot",
        "embedded"
    ],
    skills: [
        "Embedded Systems",
        "FPGA",
        "RISC-V"
    ]
},

"Data Science": {
    keywords: [
        "data analysis",
        "statistics",
        "forecasting",
        "python"
    ],
    skills: [
        "Python",
        "Data Science",
        "Analytics"
    ]
}

};

function detectDifficulty(title) {

const t = title.toLowerCase();

if (
    t.includes("international conference") ||
    t.includes("research") ||
    t.includes("advanced")
) {
    return "Advanced";
}

if (
    t.includes("workshop") ||
    t.includes("hands-on")
) {
    return "Intermediate";
}

return "Beginner";

}

function detectAudience(event) {

const title =
    event.title.toLowerCase();

const audience = [];

if (
    title.includes("research")
) {
    audience.push(
        "Researchers"
    );
}

if (
    title.includes("faculty") ||
    event.eventType === "FDP"
) {
    audience.push(
        "Faculty"
    );
}

audience.push(
    "Engineering Students"
);

return [...new Set(audience)];

}

function categorize(event) {

const text = (
    event.title +
    " " +
    event.school
).toLowerCase();

const categories = [];

const skills = [];

for (
    const [category, config]
    of Object.entries(
        CATEGORY_RULES
    )
) {

    const matched =
        config.keywords.some(
            keyword =>
                text.includes(
                    keyword.toLowerCase()
                )
        );

    if (matched) {

        categories.push(
            category
        );

        skills.push(
            ...config.skills
        );
    }
}

if (
    categories.length === 0
) {

    categories.push(
        "General Engineering"
    );
}

return {
    ...event,

    categories,

    skills: [
        ...new Set(skills)
    ],

    difficulty:
        detectDifficulty(
            event.title
        ),

    targetAudience:
        detectAudience(
            event
        )
};

}

const enriched =
events.map(categorize);

fs.writeFileSync(
"enriched_events.json",
JSON.stringify(
enriched,
null,
2
)
);

console.log(
    "Processed",
    enriched.length,
    "events"
);

console.log("\nSample Event:\n");

console.log(enriched[0]);