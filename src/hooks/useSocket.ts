'use client';

import { useEffect, useCallback } from 'react';
import { getSocket, connectSocket, disconnectSocket, onEvent } from '@/lib/socket';
import { useAppStore } from '@/lib/store';
import type { Giveaway, BonusHunt, Bonus, BonusHuntGuess, BonusHuntWinner, StreamInfo, Tournament, TournamentParticipant } from '@/types';

export const useSocket = () => {
  const user = useAppStore((state) => state.user);
  const addGiveaway = useAppStore((state) => state.addGiveaway);
  const updateGiveaway = useAppStore((state) => state.updateGiveaway);
  const addBonusHunt = useAppStore((state) => state.addBonusHunt);
  const updateBonusHunt = useAppStore((state) => state.updateBonusHunt);
  const addGuessToHunt = useAppStore((state) => state.addGuessToHunt);
  const updateBonusInHunt = useAppStore((state) => state.updateBonusInHunt);
  const setStreamInfo = useAppStore((state) => state.setStreamInfo);
  const updateUserPoints = useAppStore((state) => state.updateUserPoints);
  const addNotification = useAppStore((state) => state.addNotification);

  useEffect(() => {
    if (user) {
      connectSocket(user.id);

      // Giveaway events
      const unsubGiveawayCreated = onEvent('giveaway:created', (giveaway: Giveaway) => {
        addGiveaway(giveaway);
      });

      const unsubGiveawayWinner = onEvent(
        'giveaway:winner',
        (giveawayId: string, winnerId: string, winnerUsername: string) => {
          updateGiveaway({
            id: giveawayId,
            winnerId,
            winnerUsername,
            isActive: false,
          } as Giveaway);

          if (winnerId === user.id) {
            addNotification({
              id: Date.now().toString(),
              type: 'giveaway',
              title: 'You Won!',
              message: `Congratulations! You won the giveaway!`,
              timestamp: new Date(),
              read: false,
            });
          }
        }
      );

      // Bonus Hunt events
      const unsubBonusHuntCreated = onEvent('bonushunt:created', (hunt: BonusHunt) => {
        addBonusHunt(hunt);
        addNotification({
          id: Date.now().toString(),
          type: 'bonus_hunt',
          title: 'New Bonus Hunt!',
          message: `${hunt.name} has been created. Make your guess!`,
          timestamp: new Date(),
          read: false,
        });
      });

      const unsubBonusHuntStarted = onEvent('bonushunt:started', (huntId: string) => {
        // Update hunt status to started (predictions locked)
        updateBonusHunt({ id: huntId, status: 'started', startedAt: new Date() } as BonusHunt);
      });

      const unsubBonusHuntGuess = onEvent('bonushunt:guess', (huntId: string, guess: BonusHuntGuess) => {
        addGuessToHunt(huntId, guess);
      });

      const unsubBonusOpened = onEvent('bonushunt:bonus_opened', (huntId: string, bonus: Bonus) => {
        updateBonusInHunt(huntId, bonus);
      });

      const unsubBonusHuntCompleted = onEvent(
        'bonushunt:completed',
        (huntId: string, finalBalance: number, winners: BonusHuntWinner[]) => {
          updateBonusHunt({
            id: huntId,
            status: 'completed',
            finalBalance,
            completedAt: new Date(),
            winners,
          } as BonusHunt);

          // Check if user is a winner
          const userWin = winners.find((w) => w.userId === user.id);
          if (userWin) {
            addNotification({
              id: Date.now().toString(),
              type: 'bonus_hunt',
              title: `You placed #${userWin.rank}!`,
              message: `Your guess was $${userWin.difference} off. You won ${userWin.prize} points!`,
              timestamp: new Date(),
              read: false,
            });
          }
        }
      );

      // User events
      const unsubPointsUpdate = onEvent('user:points_update', (userId: string, points: number) => {
        if (userId === user.id) {
          updateUserPoints(points);
        }
      });

      const unsubLevelUp = onEvent('user:level_up', (userId: string, newLevel: number) => {
        if (userId === user.id) {
          addNotification({
            id: Date.now().toString(),
            type: 'level_up',
            title: 'Level Up!',
            message: `You reached level ${newLevel}!`,
            timestamp: new Date(),
            read: false,
          });
        }
      });

      // Stream events
      const unsubStreamStatus = onEvent('stream:status', (info: StreamInfo) => {
        setStreamInfo(info);
      });

      return () => {
        unsubGiveawayCreated();
        unsubGiveawayWinner();
        unsubBonusHuntCreated();
        unsubBonusHuntStarted();
        unsubBonusHuntGuess();
        unsubBonusOpened();
        unsubBonusHuntCompleted();
        unsubPointsUpdate();
        unsubLevelUp();
        unsubStreamStatus();
        disconnectSocket();
      };
    }
  }, [
    user,
    addGiveaway,
    updateGiveaway,
    addBonusHunt,
    updateBonusHunt,
    addGuessToHunt,
    updateBonusInHunt,
    setStreamInfo,
    updateUserPoints,
    addNotification,
  ]);

  const enterGiveaway = useCallback((giveawayId: string) => {
    const socket = getSocket();
    socket.emit('giveaway:enter', giveawayId);
  }, []);

  const submitGuess = useCallback((huntId: string, guessedBalance: number) => {
    const socket = getSocket();
    socket.emit('bonushunt:guess', huntId, guessedBalance);
  }, []);

  const enterTournament = useCallback((tournamentId: string) => {
    const socket = getSocket();
    socket.emit('tournament:enter', tournamentId);
  }, []);

  return {
    enterGiveaway,
    submitGuess,
    enterTournament,
  };
};
