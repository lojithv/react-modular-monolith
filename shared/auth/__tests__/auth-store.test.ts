import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthStore } from '../services/auth.service.ts';
import {
  mockAdmin,
  mockEditor,
  mockViewer,
  mockExpiredTrial,
  mockActiveTrial,
} from '../__testing__/mock-users.ts';

describe('AuthStore', () => {
  let store: AuthStore;

  beforeEach(() => {
    store = new AuthStore();
  });

  // ─── Initial State ──────────────────────────────────────

  describe('initial state', () => {
    it('starts unauthenticated by default', () => {
      const snap = store.getSnapshot();
      expect(snap.user).toBeNull();
      expect(snap.isAuthenticated).toBe(false);
    });

    it('can be initialized with a user', () => {
      const store2 = new AuthStore(mockAdmin);
      const snap = store2.getSnapshot();
      expect(snap.user).toEqual(mockAdmin);
      expect(snap.isAuthenticated).toBe(true);
    });
  });

  // ─── Login ──────────────────────────────────────────────

  describe('login', () => {
    it('sets user and marks authenticated', () => {
      store.login(mockAdmin);
      const snap = store.getSnapshot();
      expect(snap.user).toEqual(mockAdmin);
      expect(snap.isAuthenticated).toBe(true);
    });

    it('replaces existing user on re-login', () => {
      store.login(mockAdmin);
      store.login(mockEditor);
      expect(store.getSnapshot().user).toEqual(mockEditor);
    });

    it('notifies listeners', () => {
      const listener = vi.fn();
      store.subscribe(listener);
      store.login(mockAdmin);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Logout ─────────────────────────────────────────────

  describe('logout', () => {
    it('clears user and marks unauthenticated', () => {
      store.login(mockAdmin);
      store.logout();
      const snap = store.getSnapshot();
      expect(snap.user).toBeNull();
      expect(snap.isAuthenticated).toBe(false);
    });

    it('notifies listeners', () => {
      store.login(mockAdmin);
      const listener = vi.fn();
      store.subscribe(listener);
      store.logout();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Subscribe / Unsubscribe ────────────────────────────

  describe('subscribe', () => {
    it('returns an unsubscribe function', () => {
      const listener = vi.fn();
      const unsub = store.subscribe(listener);
      store.login(mockAdmin);
      expect(listener).toHaveBeenCalledTimes(1);

      unsub();
      store.logout();
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('supports multiple listeners', () => {
      const a = vi.fn();
      const b = vi.fn();
      store.subscribe(a);
      store.subscribe(b);
      store.login(mockAdmin);
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Reset ──────────────────────────────────────────────

  describe('reset', () => {
    it('clears user when called without args', () => {
      store.login(mockAdmin);
      store.reset();
      expect(store.getSnapshot().user).toBeNull();
      expect(store.getSnapshot().isAuthenticated).toBe(false);
    });

    it('sets a specific user when called with one', () => {
      store.reset(mockEditor);
      expect(store.getSnapshot().user).toEqual(mockEditor);
      expect(store.getSnapshot().isAuthenticated).toBe(true);
    });

    it('notifies listeners', () => {
      const listener = vi.fn();
      store.subscribe(listener);
      store.reset(mockAdmin);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Role Checks ───────────────────────────────────────

  describe('hasRole', () => {
    it('returns false when unauthenticated', () => {
      expect(store.hasRole('admin')).toBe(false);
    });

    it('returns true for matching single role', () => {
      store.login(mockAdmin);
      expect(store.hasRole('admin')).toBe(true);
    });

    it('returns false for non-matching single role', () => {
      store.login(mockViewer);
      expect(store.hasRole('admin')).toBe(false);
    });

    it('returns true when user role is in array', () => {
      store.login(mockEditor);
      expect(store.hasRole(['admin', 'editor'])).toBe(true);
    });

    it('returns false when user role is not in array', () => {
      store.login(mockViewer);
      expect(store.hasRole(['admin', 'editor'])).toBe(false);
    });
  });

  // ─── Feature Checks ────────────────────────────────────

  describe('hasFeature', () => {
    it('returns false when unauthenticated', () => {
      expect(store.hasFeature('analytics')).toBe(false);
    });

    it('returns true when user has the feature', () => {
      store.login(mockAdmin);
      expect(store.hasFeature('analytics')).toBe(true);
    });

    it('returns false when user lacks the feature', () => {
      store.login(mockViewer);
      expect(store.hasFeature('analytics')).toBe(false);
    });

    it('checks ALL features (AND logic) for array input', () => {
      store.login(mockAdmin);
      expect(store.hasFeature(['analytics', 'bulk-export'])).toBe(true);
      expect(store.hasFeature(['analytics', 'nonexistent'])).toBe(false);
    });
  });

  // ─── Plan Checks ───────────────────────────────────────

  describe('hasPlan', () => {
    it('returns false when unauthenticated', () => {
      expect(store.hasPlan('free')).toBe(false);
    });

    it('returns true for exact plan match', () => {
      store.login(mockEditor); // starter plan
      expect(store.hasPlan('starter')).toBe(true);
    });

    it('returns true for lower plan requirement', () => {
      store.login(mockAdmin); // pro plan
      expect(store.hasPlan('starter')).toBe(true);
      expect(store.hasPlan('free')).toBe(true);
    });

    it('returns false for higher plan requirement', () => {
      store.login(mockEditor); // starter plan
      expect(store.hasPlan('pro')).toBe(false);
      expect(store.hasPlan('enterprise')).toBe(false);
    });

    it('free user fails all non-free plan checks', () => {
      store.login(mockViewer); // free plan
      expect(store.hasPlan('free')).toBe(true);
      expect(store.hasPlan('starter')).toBe(false);
    });
  });

  // ─── Trial Checks ──────────────────────────────────────

  describe('isTrialActive', () => {
    it('returns false when unauthenticated', () => {
      expect(store.isTrialActive()).toBe(false);
    });

    it('returns false when trialEndsAt is null', () => {
      store.login(mockAdmin); // trialEndsAt: null
      expect(store.isTrialActive()).toBe(false);
    });

    it('returns true when trial is in the future', () => {
      store.login(mockActiveTrial); // trialEndsAt: 2099-...
      expect(store.isTrialActive()).toBe(true);
    });

    it('returns false when trial is in the past', () => {
      store.login(mockExpiredTrial); // trialEndsAt: 2020-...
      expect(store.isTrialActive()).toBe(false);
    });
  });

  // ─── Snapshot Immutability ──────────────────────────────

  describe('snapshot immutability', () => {
    it('returns frozen snapshot objects', () => {
      store.login(mockAdmin);
      const snap = store.getSnapshot();
      expect(Object.isFrozen(snap)).toBe(true);
    });

    it('returns a new reference after mutation', () => {
      store.login(mockAdmin);
      const snap1 = store.getSnapshot();
      store.logout();
      const snap2 = store.getSnapshot();
      expect(snap1).not.toBe(snap2);
    });
  });
});
