# ReadMates

**Check this out:** [readmates.vercel.app](https://readmates.vercel.app)

ReadMates is a collaborative hub for tech enthusiasts, writers, and readers. Designed for real-time co-editing, interactive reading experiences, and robust community engagement, ReadMates redefines how people create, share, and consume technical and general articles.

## Overview
![image](https://github.com/user-attachments/assets/984c78c3-00e0-4dd4-9910-ca873ff9ff48)

## Features

### Collaborative Article Creation
- **Real-Time Co-Editing:** Seamless content creation using a Tiptap-based editor with live collaboration.
- **Version Control:** Wikipedia-style tracking of edits with MongoDB revision history.
- **Inline Comments:** Comment on specific sections of text for better feedback.
- **Integrated Video/Audio Calls:** Discuss with collaborators directly while editing.

### Enhanced Reading Experience
- **Distraction-Free Reader Mode:** Customizable themes and adjustable fonts for a personalized reading experience.
- **Interactive Tools:** Highlight text, add annotations, and save bookmarks for easy reference.
- **Collaborative Reading:** Invite peers to read together with synchronized scrolling.

### Content Publishing and Profiles
- **Publishing System:** Submit and publish articles with community-driven peer reviews to ensure quality.
- **Personal Profiles:** Showcase your contributions, articles, and achievements in one place.

### Community Features
- **Discussion Boards:** Engage in topic-specific forums to foster discussions.
- **"Ask the Author":** Direct Q&A feature for readers to interact with authors and get insights.
- **Social Sharing and Notifications:** Share articles effortlessly and receive notifications for updates.

### Gamification and Recognition
- **Reward System:** Earn points for publishing, providing feedback, and engaging with the community.
- **Badges:** Recognize contributions with awards like "Tech Guru" and "Top Critic" to motivate participation.

### Personalized Learning and Recommendations
- **Tailored Content:** Suggest articles based on your reading history and interests to enhance learning.
- **Reading Progress:** Track time spent reading and monitor your progress within articles.

## Tech Stack

- **Frontend:** React.js, Tiptap Editor, Socket.IO, WebRTC
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Add-Ons:** Cloudinary for media storage, JWT for authentication

## Installation

To get started with ReadMates, clone the repository and install the dependencies:

```bash
git clone https://github.com/KshKnsl/ReadMates.git
cd ReadMates
npm install
