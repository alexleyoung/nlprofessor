const { Pinecone } = require("@pinecone-database/pinecone");
const { createClient } = require("@supabase/supabase-js");
const { default: OpenAI } = require("openai");

data = {
  reviews: [
    {
      id: 1,
      professor_name: "Dr. Sarah Johnson",
      department: "Physics",
      course_code: "PHY301",
      rating: 4.5,
      difficulty: 3.8,
      comment: "Challenging but fair. Great at explaining complex concepts.",
      would_take_again: true,
      date: "2024-03-15",
      grade: "A-",
    },
    {
      id: 2,
      professor_name: "Prof. Michael Lee",
      department: "Computer Science",
      course_code: "CS201",
      rating: 3.2,
      difficulty: 4.5,
      comment: "Tough grader, but you'll learn a lot if you put in the effort.",
      would_take_again: false,
      date: "2024-02-28",
      grade: "B",
    },
    {
      id: 3,
      professor_name: "Dr. Emily Chen",
      department: "Biology",
      course_code: "BIO102",
      rating: 4.8,
      difficulty: 2.5,
      comment: "Engaging lectures and very approachable. Highly recommended!",
      would_take_again: true,
      date: "2024-03-10",
      grade: "A+",
    },
    {
      id: 4,
      professor_name: "Prof. David Brown",
      department: "History",
      course_code: "HIS205",
      rating: 3.9,
      difficulty: 3.2,
      comment: "Interesting content, but assignments can be vague.",
      would_take_again: true,
      date: "2024-03-05",
      grade: "B+",
    },
    {
      id: 5,
      professor_name: "Dr. Lisa Wong",
      department: "Psychology",
      course_code: "PSY301",
      rating: 4.2,
      difficulty: 3.5,
      comment: "Passionate about the subject. Exams are tough but fair.",
      would_take_again: true,
      date: "2024-03-20",
      grade: "A-",
    },
    {
      id: 6,
      professor_name: "Prof. Robert Taylor",
      department: "Mathematics",
      course_code: "MAT202",
      rating: 3.5,
      difficulty: 4.7,
      comment:
        "Brilliant mathematician, but struggles to explain concepts clearly.",
      would_take_again: false,
      date: "2024-02-25",
      grade: "C+",
    },
    {
      id: 7,
      professor_name: "Dr. Amanda Garcia",
      department: "Chemistry",
      course_code: "CHEM301",
      rating: 4.6,
      difficulty: 4.0,
      comment: "Challenging course, but Dr. Garcia makes it enjoyable.",
      would_take_again: true,
      date: "2024-03-18",
      grade: "A",
    },
    {
      id: 8,
      professor_name: "Prof. James Wilson",
      department: "English",
      course_code: "ENG205",
      rating: 3.8,
      difficulty: 2.8,
      comment: "Thought-provoking discussions, but grading can be subjective.",
      would_take_again: true,
      date: "2024-03-12",
      grade: "B+",
    },
    {
      id: 9,
      professor_name: "Dr. Rachel Kim",
      department: "Sociology",
      course_code: "SOC101",
      rating: 4.7,
      difficulty: 2.2,
      comment:
        "Engaging lecturer and very understanding. Easy A if you participate.",
      would_take_again: true,
      date: "2024-03-22",
      grade: "A",
    },
    {
      id: 10,
      professor_name: "Prof. Thomas Martinez",
      department: "Economics",
      course_code: "ECON202",
      rating: 3.4,
      difficulty: 4.2,
      comment:
        "Dry lectures, but the material is important. Be prepared to self-study.",
      would_take_again: false,
      date: "2024-03-08",
      grade: "C",
    },
    {
      id: 11,
      professor_name: "Dr. Jennifer Patel",
      department: "Art History",
      course_code: "ART301",
      rating: 4.9,
      difficulty: 3.0,
      comment: "Passionate and knowledgeable. Makes art history come alive!",
      would_take_again: true,
      date: "2024-03-25",
      grade: "A+",
    },
    {
      id: 12,
      professor_name: "Prof. William Chang",
      department: "Political Science",
      course_code: "POLI205",
      rating: 4.1,
      difficulty: 3.7,
      comment:
        "Balanced perspective on controversial topics. Stimulating debates.",
      would_take_again: true,
      date: "2024-03-14",
      grade: "B+",
    },
    {
      id: 13,
      professor_name: "Dr. Olivia Foster",
      department: "Environmental Science",
      course_code: "ENV202",
      rating: 4.3,
      difficulty: 3.3,
      comment: "Relevant and eye-opening course. Field trips are a highlight.",
      would_take_again: true,
      date: "2024-03-19",
      grade: "A-",
    },
    {
      id: 14,
      professor_name: "Prof. Daniel Murphy",
      department: "Philosophy",
      course_code: "PHIL101",
      rating: 3.7,
      difficulty: 4.1,
      comment:
        "Challenging concepts, but Prof. Murphy is always willing to explain.",
      would_take_again: true,
      date: "2024-03-07",
      grade: "B",
    },
    {
      id: 15,
      professor_name: "Dr. Sophia Rodriguez",
      department: "Linguistics",
      course_code: "LING301",
      rating: 4.4,
      difficulty: 3.6,
      comment:
        "Fascinating subject matter. Dr. Rodriguez is enthusiastic and helpful.",
      would_take_again: true,
      date: "2024-03-21",
      grade: "A",
    },
    {
      id: 16,
      professor_name: "Prof. Andrew Thompson",
      department: "Business",
      course_code: "BUS202",
      rating: 3.6,
      difficulty: 3.9,
      comment:
        "Real-world examples make the course relevant, but heavy workload.",
      would_take_again: false,
      date: "2024-03-02",
      grade: "B-",
    },
    {
      id: 17,
      professor_name: "Dr. Natalie Wright",
      department: "Neuroscience",
      course_code: "NEUR301",
      rating: 4.8,
      difficulty: 4.3,
      comment:
        "Brilliant professor. Difficult material, but Dr. Wright makes it digestible.",
      would_take_again: true,
      date: "2024-03-23",
      grade: "A",
    },
    {
      id: 18,
      professor_name: "Prof. Christopher Lee",
      department: "Music",
      course_code: "MUS101",
      rating: 4.5,
      difficulty: 2.1,
      comment: "Fun and interactive classes. Great for non-music majors too.",
      would_take_again: true,
      date: "2024-03-16",
      grade: "A",
    },
    {
      id: 19,
      professor_name: "Dr. Elizabeth Baker",
      department: "Anthropology",
      course_code: "ANTH205",
      rating: 4.2,
      difficulty: 3.4,
      comment: "Insightful lectures and interesting assignments. Fair grader.",
      would_take_again: true,
      date: "2024-03-09",
      grade: "B+",
    },
    {
      id: 20,
      professor_name: "Prof. Kevin Zhang",
      department: "Computer Engineering",
      course_code: "CE301",
      rating: 3.9,
      difficulty: 4.6,
      comment:
        "Cutting-edge content, but fast-paced. Office hours are very helpful.",
      would_take_again: true,
      date: "2024-03-17",
      grade: "B",
    },
  ],
};

reviews = data.reviews;

let revisedReviews = { reviews: [] };

reviews.forEach((review) => {
  revisedReviews.reviews.push({ ...review, professor_id: review.id });
});

const pc = new Pinecone({ apiKey });
const ai = new OpenAI({
  apiKey,
});
const index = pc.index("ai-professor").namespace("ns1");

(async () => {
  let processed = await Promise.all(
    revisedReviews.reviews.map(async (review) => {
      const response = await ai.embeddings.create({
        input: review.comment,
        model: "text-embedding-3-small",
      });
      const embedding = response.data[0].embedding;

      const embed = {
        id: String(review.id),
        values: embedding,
        metadata: review,
      };

      return embed;
    })
  );
  index.upsert(processed);
})();
