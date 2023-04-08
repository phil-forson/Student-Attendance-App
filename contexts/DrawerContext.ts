import { DrawerNavigationProp } from '@react-navigation/drawer';
import { createContext } from 'react';

type DrawerContextType = DrawerNavigationProp<Record<string, object | undefined>, string>;

export const DrawerContext = createContext<DrawerContextType | undefined>(undefined);
