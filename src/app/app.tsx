import { useEffect, useState } from 'react';
import CollectableCard from './collectable-card/collectable-card';
import { CollectionRecord } from './models/philately';
import { CommandMessage, Commands } from './models/commands';
import { PhilatelyProduct } from './models/philately-product';
import { mapProductToCollectionRecord } from './services/map-product-to-collection-record';
import { messageService } from './services/message-service';
import styles from './app.module.scss';

function App() {
  const [collectionRecord, setCollectionRecord] = useState<CollectionRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    messageService
      .sendMessageToActiveTab<CommandMessage, { data: PhilatelyProduct, error?: string }>({
        command: Commands.GetCollectableInfo
      })
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error);
        }
        return data;
      })
      .then(mapProductToCollectionRecord)
      .then(setCollectionRecord)
      .catch((error) => {
        setErrorMessage(error.toString());
      });
  }, [setErrorMessage, setCollectionRecord]);

  return (
    <div className={styles.app}>
      <header>
        <img
          src={'/images/lp-logo.svg'}
          alt="Lietuvos paštas logo"
        />
        <img
          src={'/images/lp-filatelija.png'}
          alt="Lietuvos paštas filatelija"
        />
        <h1 className="text-3xl font-bold underline">Lietuvos paštas</h1>
      </header>
      {errorMessage && <p>{JSON.stringify(errorMessage, null, 2)}</p>}
      {collectionRecord && (
        <main>
          <CollectableCard data={collectionRecord} />
        </main>
      )}
    </div>
  );
}

export default App;
