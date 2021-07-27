import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface fecthImagesProps {
  pageParam?: string;
}

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

async function fecthImages({
  pageParam = null,
}: fecthImagesProps): Promise<any> {
  const response = await api.get('/api/images', {
    params: { after: pageParam },
  });
  return response.data;
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fecthImages, {
    getNextPageParam: lastPage => lastPage.after,
  });

  const formattedData = useMemo(() => {
    const allData = data?.pages.map<Image[]>(page => page.data).flat();
    return allData;
  }, [data]);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;
  
  return (
    <>
      <Header />
      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button mt="8" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}