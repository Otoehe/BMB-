export type User = {
  id: string;
  username: string;
  role: 'actor' | 'musician' | 'escort' | 'daredevil' | 'waiter' | 'romantic' | string;
  avatarUrl: string;
  lat: number;
  lng: number;
  verified: boolean;
  storyVideoUrl?: string;
  lastStoryTime?: string;
};

export const users: User[] = [
  {
    id: '1',
    username: 'John',
    role: 'actor',
    avatarUrl: '/avatars/john.jpg',
    lat: 50.4501,
    lng: 30.5234,
    verified: true,
    storyVideoUrl: '/stories/john.mp4',
    lastStoryTime: '2025-06-22T07:00:00Z'
  },
  {
    id: '2',
    username: 'Maria',
    role: 'escort',
    avatarUrl: '/avatars/maria.jpg',
    lat: 50.4601,
    lng: 30.5334,
    verified: true
  }
];
