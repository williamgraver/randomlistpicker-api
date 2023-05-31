import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Picker from '../components/picker'

export default function Home({ }) {
  const router = useRouter()
  const {list, pickedItems, seed} = router.query
  const [pickedElements, setPickedElements] = useState([]);
  const [error, setErrors] = useState(false);
  
  useEffect(() => {
    if (list && pickedItems) {
      let parsedlist = list.split(",").filter((str)=> str !== "");
      
      if (parsedlist.length < pickedItems) {
        setErrors(true);
        return;
      } else if(parsedlist.length == pickedItems) {
        setPickedElements(parsedlist);
        return;
      }
      
      console.log(pickedItems, parsedlist.length);
      var gen = require('random-seed');
      var usedSeed = seed;
      if (!seed) {
        usedSeed = encodeURI(gen.create().string(50));
        console.log(usedSeed);
        router.push(`/?list=${list}&pickedItems=${pickedItems}&seed=${usedSeed}`, undefined, { shallow: true });
      }
      var randomGenerator = gen.create(usedSeed);
      var randomizedElements = [];
      for (var i = 0; i < pickedItems; i++) {
        var randomIndex = randomGenerator.intBetween(0, parsedlist.length - 1);
        randomizedElements.push(parsedlist[randomIndex]);
        parsedlist.splice(randomIndex, 1);
      }
  
      setPickedElements(randomizedElements);
      console.log(randomizedElements);
    }
  }, [list, pickedItems, seed]);
 
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Here is a description</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <Picker elements={pickedElements}></Picker>
        <h2 className={utilStyles.headingLg}>Picked elements</h2>
        {error && <p>There was an error</p>}
        {pickedElements.map((value, index)=> {
          return (<p key={index}>{value}</p>)
        })}
      </section>
    </Layout>
  )
}