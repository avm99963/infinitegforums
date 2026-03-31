import { createContext } from '@lit/context';
import { ReplySoftLockUserSelectionRepositoryPort } from '../../repositories/userSelection.repository.port';

export const userSelectionRepositoryContext =
  createContext<ReplySoftLockUserSelectionRepositoryPort>(
    'reply-soft-lock-get-user-selection-repository',
  );
