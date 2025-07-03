import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPzOUQ4SGs1lg1Fl8kyNpzuRSLlryGrmE",
  authDomain: "jobverse-6fadc.firebaseapp.com",
  projectId: "jobverse-6fadc",
  storageBucket: "jobverse-6fadc.firebasestorage.app",
  messagingSenderId: "629421733545",
  appId: "1:629421733545:web:5a126c4e580a0e832b1bb8",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Sample data generators
const titles = [
  "Frontend Developer", "Backend Developer", "Full Stack Engineer", "UI/UX Designer", "Data Analyst",
  "DevOps Engineer", "React Developer", "Node.js Developer", "Product Manager", "Digital Marketer"
];

const companies = [
  "TechNova Pvt. Ltd.", "CodeCrushers Inc.", "AdWise Digital", "ByteWorks", "MarketX", "DesignHut Ltd.",
  "GrowthLoop", "SmartPay India", "Learnly", "CloudBridge"
];

const locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Remote", "Chennai", "Pune", "Kolkata"];
const types = ["Full-time", "Part-time", "Internship", "Contract"];
const categories = ["IT & Software", "Marketing", "Finance", "Design", "Sales", "Remote Jobs"];
const salaryRanges = ["₹3-5 LPA", "₹4-6 LPA", "₹5-8 LPA", "₹8-12 LPA", "₹10-15 LPA"];

const descriptions = [
  "We are looking for a passionate individual to join our growing team.",
  "Exciting opportunity to work on cutting-edge technology with a young and energetic team.",
  "Experience with modern frameworks is a plus. Apply now!",
  "A fast-paced role for someone who enjoys a challenge.",
  "We value innovation, creativity, and ownership."
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ✅ Generate dummy jobs
const generateJobs = (count: number) => {
  const jobs = [];
  for (let i = 0; i < count; i++) {
    jobs.push({
      title: getRandomItem(titles),
      company: getRandomItem(companies),
      location: getRandomItem(locations),
      type: getRandomItem(types),
      category: getRandomItem(categories),
      salary: getRandomItem(salaryRanges),
      description: getRandomItem(descriptions),
      postedAt: Timestamp.fromDate(new Date()),
    });
  }
  return jobs;
};

// ✅ Push to Firestore
async function addJobsToFirebase() {
  const jobs = generateJobs(50); // Generate 50 dummy jobs
  try {
    for (const job of jobs) {
      await addDoc(collection(db, "jobs"), job);
      console.log(`✔️ Added job: ${job.title} at ${job.company}`);
    }
    console.log("🎉 All 50 jobs added to Firebase!");
  } catch (err) {
    console.error("❌ Error adding jobs:", err);
  }
}

addJobsToFirebase();
