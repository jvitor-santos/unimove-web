import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

import { firestore } from '@/firebase/client';

type TGetUserProps = {
  groupId: string;
  userId: string;
};

export const getUserGroup = async ({
  groupId,
  userId,
}: TGetUserProps): Promise<any> => {
  if (!groupId || !userId) {
    throw new Error('Group ID and User ID are required.');
  }

  const route = `groups/${groupId}/users/${userId}`;

  try {
    const userRef = doc(firestore, route);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      throw new Error('User not found.');
    }

    const user = userSnapshot.data() as any;

    return user;
  } catch (err) {
    console.log('Error fetching user:', err);
    throw new Error('Failed to fetch user data.');
  }
};

export const useGetUserGroup = (
  groupId: string | null,
  userId: string | null
): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['user-data', groupId, userId],
    queryFn: () => getUserGroup({ groupId: groupId!, userId: userId! }),
    enabled: !!groupId && !!userId,
    staleTime: 60 * 60 * 1000, 
  });
};