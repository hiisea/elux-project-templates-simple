import NavBar from '@/components/NavBar';
/*# if:!taro #*/
import TabBar from '@/components/TabBar';
/*# end #*/
import {APPState, Modules, useRouter/*# =vue?, useStore: #*/} from '@/Global';
import {excludeDefaultParams} from '@/utils/tools';
/*# if:react #*/
import {connectRedux, Dispatch, DocumentHead, Link, locationToUrl} from '<%= elux %>';
/*# else:vue #*/
import {ComputedStore, DocumentHead, exportView, Link, locationToUrl} from '<%= elux %>';
/*# end #*/
/*# if:taro #*/
import {navigateTo} from '@tarojs/taro';
/*# end #*/
/*# if:react #*/
import {FC, useCallback, useMemo} from 'react';
/*# else:vue #*/
import {computed, defineComponent} from 'vue';
/*# end #*/
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import {defaultListSearch, ListItem, ListSearch, ListSummary} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  prefixPathname: string;
  listSearch: ListSearch;
  list/*# =pre??: #*/: ListItem[];
  listSummary/*# =pre??: #*/: ListSummary;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  const {prefixPathname, listSearch, list, listSummary} = appState.article!;
  /*# if:pre #*/
  return {prefixPathname, listSearch, list, listSummary};
  /*# else #*/
  return {prefixPathname, listSearch: listSearch, list: list!, listSummary: listSummary!};
  /*# end #*/
}
/*# else:vue #*/
//这里保持和Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const article = appState.article!;
  return {
    prefixPathname: () => article.prefixPathname,
    listSearch: () => article.listSearch,
    list: () => article.list/*# =post?!: #*/,
    listSummary: () => article.listSummary/*# =post?!: #*/,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps & {dispatch: Dispatch}> = ({prefixPathname, listSearch, list, listSummary, dispatch}) => {
  const router = useRouter();
  const paginationBaseUrl = useMemo(
    () =>
      locationToUrl({
        pathname: `${prefixPathname}/list`,
        searchQuery: excludeDefaultParams(defaultListSearch, {keyword: listSearch?.keyword, pageCurrent: 0}),
      }),
    [listSearch?.keyword, prefixPathname]
  );
  const onSearch = useCallback(
    (keyword: string) => {
      router.push({pathname: `${prefixPathname}/list`, searchQuery: excludeDefaultParams(defaultListSearch, {keyword})}, 'page');
    },
    [router, prefixPathname]
  );
  const onDeleteItem = useCallback(
    (id) => {
      dispatch(Modules.article.actions.deleteItem(id));
    },
    [dispatch]
  );
  const onEditItem = useCallback(
    (id = '0') => {
      router.push({url: `${prefixPathname}/edit?id=${id}`}, 'window');
    },
    [router, prefixPathname]
  );
  /*# if:taro #*/
  const onNavToShop = useCallback(() => navigateTo({url: '/modules/shop/pages/list'}), []);
  /*# end #*/

  return (
    <>
      <NavBar title="文章列表" />
      <div className={`${styles.root} g-page-content`}>
        <DocumentHead title="文章列表" />
        <SearchBar keyword={listSearch.keyword} onSubmit={onSearch} onCreate={onEditItem} />
        /*# if:pre #*/
        {list && listSummary && (
        /*# end #*/
          <div className="list">
            {list.map((item) => (
              <div key={item.id} className="article-item">
                <Link className="article-title" to={`${prefixPathname}/detail?id=${item.id}`} action="push" target="window">
                  {item.title}
                </Link>
                <Link className="article-summary" to={`${prefixPathname}/detail?id=${item.id}`} action="push" target="window">
                  {item.summary}
                </Link>
                <div className="article-operation">
                  <div className="item" onClick={() => onEditItem(item.id)}>
                    修改
                  </div>
                  <div className="item" onClick={() => onDeleteItem(item.id)}>
                    删除
                  </div>
                </div>
              </div>
            ))}
            <Pagination totalPages={listSummary.totalPages} pageCurrent={listSummary.pageCurrent} baseUrl={paginationBaseUrl} />
            /*# if:taro #*/
            <div className="g-ad" onClick={onNavToShop}>
              -- 特惠商城，盛大开业 --
            </div>
            /*# else #*/
            <Link className="g-ad" to="/shop/list" action="push" target="window">
              -- 特惠商城，盛大开业 --
            </Link>
            /*# end #*/
          </div>
        /*# if:pre #*/
        )}
        /*# end #*/
      </div>
      /*# if:!taro #*/
      <TabBar selected="article" />
      /*# end #*/
    </>
  );
};

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'ArticleList',
  setup() {
    const router = useRouter();
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const prefixPathname = computed(computedStore.prefixPathname);
    const listSearch = computed(computedStore.listSearch);
    const list = computed(computedStore.list);
    const listSummary = computed(computedStore.listSummary);
    const paginationBaseUrl = computed(() =>
      locationToUrl({
        pathname: `${prefixPathname.value}/list`,
        searchQuery: excludeDefaultParams(defaultListSearch, {keyword: listSearch.value?.keyword, pageCurrent: 0}),
      })
    );
    const onSearch = (keyword: string) => {
      router.push({pathname: `${prefixPathname.value}/list`, searchQuery: excludeDefaultParams(defaultListSearch, {pageCurrent: 1, keyword})}, 'page');
    };
    const onDeleteItem = (id: string) => {
      store.dispatch(Modules.article.actions.deleteItem(id));
    };
    const onEditItem = (id: string = '0') => {
      router.push({url: `${prefixPathname.value}/edit?id=${id}`}, 'window');
    };
    /*# if:taro #*/
    const onNavToShop = () => navigateTo({url: '/modules/shop/pages/list'});
    /*# end #*/

    return () => (
      <>
        <NavBar title="文章列表" />
        <div class={`${styles.root} g-page-content`}>
          <DocumentHead title="文章列表" />
          <SearchBar keyword={listSearch.value.keyword} onSubmit={onSearch} onCreate={onEditItem} />
          /*# if:pre #*/
          {list.value && listSummary.value && (
          /*# end #*/
            <div class="list">
              {list.value.map((item) => (
                <div key={item.id} class="article-item">
                  <Link class="article-title" to={`${prefixPathname.value}/detail?id=${item.id}`} action="push" target="window">
                    {item.title}
                  </Link>
                  <Link class="article-summary" to={`${prefixPathname.value}/detail?id=${item.id}`} action="push" target="window">
                    {item.summary}
                  </Link>
                  <div class="article-operation">
                    <div class="item" onClick={() => onEditItem(item.id)}>
                      修改
                    </div>
                    <div class="item" onClick={() => onDeleteItem(item.id)}>
                      删除
                    </div>
                  </div>
                </div>
              ))}
              <Pagination totalPages={listSummary.value.totalPages} pageCurrent={listSummary.value.pageCurrent} baseUrl={paginationBaseUrl.value} />
              /*# if:taro #*/
              <div class="g-ad" onClick={onNavToShop}>
                -- 特惠商城，盛大开业 --
              </div>
              /*# else #*/
              <Link class="g-ad" to="/shop/list" action="push" target="window">
                -- 特惠商城，盛大开业 --
              </Link>
              /*# end #*/
            </div>
          /*# if:pre #*/
          )}
          /*# end #*/
        </div>
        /*# if:!taro #*/
        <TabBar selected="article" />
        /*# end #*/
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/
