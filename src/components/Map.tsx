import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { users as mockUsers, User } from '../data/users';
import 'leaflet/dist/leaflet.css';

// Map of roles to tailwind color classes
const roleColors: Record<string, string> = {
  actor: 'blue-500',
  musician: 'purple-500',
  escort: 'rose-500',
  daredevil: 'red-500',
  romantic: 'pink-400',
  waiter: 'green-500',
  default: 'gray-400',
};

// Create Leaflet divIcon with avatar and pulse
const createDivIcon = (user: User) => {
  const color = roleColors[user.role] || roleColors.default;
  const html = `
    <div class="relative flex items-center justify-center">
      <div class="absolute animate-ping rounded-full w-12 h-12 border-2 border-${color}"></div>
      <img src="${user.avatarUrl}" class="w-8 h-8 rounded-full border-2 border-white" />
    </div>`;
  return L.divIcon({ html, className: '' });
};

const CenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  map.setView([lat, lng]);
  return null;
};

const filterRoles = [
  { label: 'усі', value: 'all' },
  { label: 'актор', value: 'actor' },
  { label: 'музикант', value: 'musician' },
  { label: 'ескорт', value: 'escort' },
  { label: 'відчайдух', value: 'daredevil' },
  { label: 'офіціант', value: 'waiter' },
  { label: 'романтик', value: 'romantic' },
];

const Map: React.FC<{ users?: User[] }> = ({ users = mockUsers }) => {
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeUser, setActiveUser] = useState<User | null>(null);

  const filtered = useMemo(
    () => users.filter(u => u.verified && (roleFilter === 'all' || u.role === roleFilter)),
    [users, roleFilter]
  );

  const lastUser = filtered[filtered.length - 1] || users[0];

  const activeStories = useMemo(
    () =>
      users.filter(
        u =>
          u.storyVideoUrl &&
          u.lastStoryTime &&
          Date.now() - new Date(u.lastStoryTime).getTime() < 24 * 60 * 60 * 1000
      ),
    [users]
  );

  return (
    <div className="relative h-screen w-full">
      {/* Stories */}
      {activeStories.length > 0 && (
        <div className="absolute top-0 left-0 right-0 z-[1000] flex overflow-x-auto space-x-4 p-4">
          {activeStories.map(story => (
            <button key={story.id} className="flex-shrink-0" onClick={() => setActiveUser(story)}>
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 overflow-hidden">
                <img src={story.avatarUrl} alt={story.username} className="w-full h-full object-cover" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="absolute top-4 right-4 z-[1000] bg-white bg-opacity-80 rounded-md p-2 flex space-x-2">
        {filterRoles.map(f => (
          <button
            key={f.value}
            onClick={() => setRoleFilter(f.value)}
            className={`px-3 py-1 rounded text-sm ${roleFilter === f.value ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <MapContainer center={[lastUser.lat, lastUser.lng]} zoom={13} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CenterMap lat={lastUser.lat} lng={lastUser.lng} />
        {filtered.map(user => (
          <Marker
            key={user.id}
            position={[user.lat, user.lng]}
            icon={createDivIcon(user)}
            eventHandlers={{ click: () => setActiveUser(user) }}
          />
        ))}
      </MapContainer>

      {/* Profile Drawer */}
      {activeUser && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween' }}
          className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg z-[1100] p-4 overflow-y-auto"
        >
          <button className="mb-4" onClick={() => setActiveUser(null)}>Закрити</button>
          <div className="flex flex-col items-center space-y-4">
            <img src={activeUser.avatarUrl} className="w-24 h-24 rounded-full" />
            <h2 className="text-xl font-semibold">{activeUser.username}</h2>
            <p className="capitalize">{activeUser.role}</p>
            {activeUser.storyVideoUrl && (
              <video src={activeUser.storyVideoUrl} controls className="w-full" />
            )}
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Переглянути сценарії</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded">Написати</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Map;
