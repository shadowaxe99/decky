// js/threejs/multiplayer.js

import * as THREE from './three.min.js';
import { io } from 'socket.io-client';
import { avatarsData } from './avatars.js';
import { scene, camera, renderer } from './environment.js';

const socket = io('https://your-multiplayer-server.com');

let otherPlayers = {};

function initMultiplayer() {
  socket.on('connect', () => {
    console.log('Connected to multiplayer server with id:', socket.id);
    socket.emit('newPlayer', { id: socket.id, avatar: avatarsData.defaultAvatar });
  });

  socket.on('newPlayer', (playerData) => {
    console.log('New player joined:', playerData.id);
    const newPlayer = createOtherPlayer(playerData);
    otherPlayers[playerData.id] = newPlayer;
    scene.add(newPlayer);
  });

  socket.on('playerMoved', (playerData) => {
    if (otherPlayers[playerData.id]) {
      otherPlayers[playerData.id].position.copy(playerData.position);
      otherPlayers[playerData.id].quaternion.copy(playerData.quaternion);
    }
  });

  socket.on('playerLeft', (playerId) => {
    if (otherPlayers[playerId]) {
      scene.remove(otherPlayers[playerId]);
      delete otherPlayers[playerId];
    }
  });
}

function createOtherPlayer(playerData) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(playerData.position);
  mesh.quaternion.copy(playerData.quaternion);
  return mesh;
}

function updatePlayerPosition() {
  const playerData = {
    id: socket.id,
    position: camera.position,
    quaternion: camera.quaternion
  };
  socket.emit('playerMoved', playerData);
}

function animateMultiplayer() {
  requestAnimationFrame(animateMultiplayer);
  updatePlayerPosition();
}

export { initMultiplayer, animateMultiplayer };