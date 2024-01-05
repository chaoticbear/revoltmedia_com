import { getClient } from '@faustwp/experimental-app-router';
import { gql } from '@apollo/client';
import Link from 'next/link';

const GetPostsQuery = gql`
  query GetPosts {
    posts {
      nodes {
        id
        title
        uri
        slug
      }
    }
  }
`

const GetPagesQuery = gql`
  query GetPages {
    pages {
      nodes {
        id
        title
        uri
        slug
      }
    }
  }
`


const Home = async () => {
  let client = await getClient()

  const { data: postData } = await client.query({
    query: GetPostsQuery,
  });

  const { data: pageData } = await client.query({
    query: GetPagesQuery,
  });

  return (
    <main>
      <h2>Posts</h2>
      <ul>
        {postData.posts.nodes.map((post) => (
          <li>
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>

      <h2>Pages</h2>
      <ul>
        {pageData.pages.nodes.map((page) => (
          <li>
            <Link href={`/${page.slug}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Home