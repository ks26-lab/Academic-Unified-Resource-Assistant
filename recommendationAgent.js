const fs = require("fs");

const events = JSON.parse(
    fs.readFileSync(
        "enriched_events.json",
        "utf8"
    )
);

const studentProfile = {
    branch: "Computer Engineering",

    year: 2,

    interests: [
        "Artificial Intelligence",
        "Cybersecurity",
        "Backend Development",
        "Research"
    ],

    goals: [
        "Internship",
        "Research",
        "AI Engineer"
    ]
};

function calculateScore(event) {

    let score = 0;

    const reasons = [];

    // Interest Matching

    if (event.categories) {

        event.categories.forEach(category => {

            studentProfile.interests.forEach(interest => {

                if (
                    category
                        .toLowerCase()
                        .includes(
                            interest.toLowerCase()
                        )
                ) {

                    score += 50;

                    reasons.push(
                        `Matches interest: ${interest}`
                    );
                }

            });

        });

    }

    // Skill Matching

    if (event.skills) {

        event.skills.forEach(skill => {

            studentProfile.interests.forEach(interest => {

                if (
                    skill
                        .toLowerCase()
                        .includes(
                            interest.toLowerCase()
                        )
                ) {

                    score += 15;

                    reasons.push(
                        `Related skill: ${skill}`
                    );
                }

            });

        });

    }

    // Research Goal

    if (
        studentProfile.goals.includes(
            "Research"
        ) &&
        event.categories &&
        event.categories.includes(
            "Research"
        )
    ) {

        score += 25;

        reasons.push(
            "Supports research goal"
        );
    }

    // Difficulty Bonus

    if (
        event.difficulty ===
        "Advanced"
    ) {

        score += 10;
    }

    return {
        score,
        reasons
    };
}

const recommendations =
    events.map(event => {

        const result =
            calculateScore(event);

        return {
            ...event,
            score: result.score,
            reasons: result.reasons
        };

    })
    .sort(
        (a, b) =>
            b.score - a.score
    );

console.log(
    "\nTOP RECOMMENDATIONS\n"
);

recommendations
    .slice(0, 10)
    .forEach(event => {

        console.log(
            "\n--------------------------------"
        );

        console.log(
            `Score: ${event.score}`
        );

        console.log(
            `Title: ${event.title}`
        );

        console.log(
            `Categories: ${event.categories.join(", ")}`
        );

        console.log(
            `Difficulty: ${event.difficulty}`
        );

        console.log(
            "Reasons:"
        );

        event.reasons.forEach(reason => {

            console.log(
                `- ${reason}`
            );

        });

    });