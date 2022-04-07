new Vue({
    el: '#app',
    data: {
       message: "hello vue",
        products:[],
        categories: [],
       order: {
          dir:1,
          column: 'name'
       },
       filter: {
          name: '',
          keywords: ''
       },
       isSearching: false,

       currentPage: 1,

       perPage: 10,

       product: {
          id:null,
          name: '',
          category: '',
          price: ''
       },

       isEdit: false
   },
   mounted() {
       this.fetchProduct();
       this.fetchCategories();
   },
   computed: {
       productsSorted() {
        return  this.productsFiltered.sort((a,b)=> {
           let left = a[this.order.column], right = b[this.order.column]
           if(isNaN(left)  && isNaN(right)) {
              if(left > right)
                 return 1 * this.order.dir;
              else if (left < right)
                 return -1 * this.order.dir;
              else
                 return 0;
           } else
         return  (left - right) * this.order.dir
        })
       },
      classes() {
          return 'sort-control'
      },
      direction() {
           return  this.order.dir === 1 ? 'ascending':'descending';
      },

      productsFiltered() {
          let products = this.products;
          let findName = new RegExp(this.filter.name, 'i')
          if(this.filter.name) {
             products = products.filter(el =>  el.name.match(findName))
          }
          return products;
      },

      productsPaginated() {
         let start = (this.currentPage - 1) * this.perPage;
         let end =  (this.currentPage) * this.perPage;

         return this.productsSorted.slice(start, end)
      },

      keywordsIsInvalid() {
          return this.filter.keywords.length < 3;
      },
      isFirstPage() {
         return this.currentPage === 1;
      },

      isLastPage() {
          return this.currentPage === this.pages;
      },

      pages() {
          return Math.ceil(this.productsFiltered.length / this.perPage);
      },

      modalTextButton() {
          return this.isEdit ? "Update" : "Save";
      },

      modalTitle() {
          return this.isEdit ? "Update the Product" : "Add new Product";
      }
   },
   methods: {
      fetchProduct() {
         axios.get('https://product-management-backend/api/products').
         then(response => {
            this.products = response.data.data;
         });
      },

       fetchCategories() {
           axios.get('https://product-management-backend/api/categories').
           then(response => {
               this.categories = response.data.data;
           });
       },
       prev() {
          if(!this.isFirstPage)
          this.currentPage --;
       },

      next() {
          if(!this.isLastPage)
             this.currentPage ++;
      },

      switchPage(page) {
          this.currentPage = page;
      },

       sort(column) {
          this.order.column = column;
          this.order.dir *= -1;
       },
      clearInput() {
         this.filter.name = this.filter.keywords = '';
         this.isSearching = false;
      },
      search() {
          if(!this.keywordsIsInvalid)
          this.filter.name = this.filter.keywords;
          this.isSearching = true;
      },

      add() {

         this.isEdit = false;

         this.product = {
            id:null,
            name:'',
            category: '',
            price: ''
         }

         $(this.$refs.vueModal).modal('show');
      },

      edit(product) {
          this.isEdit = true;

          this.product = Object.assign({},product);

         $(this.$refs.vueModal).modal('show');
      },

      save() {
          if(this.product.name && this.product.category && this.product.price) {
             this.product.id = this.products.length + 1;

             this.products.unshift(this.product)
             this.product = {
                id:null,
                name:'',
                category: '',
                price: ''
             }

             $(this.$refs.vueModal).modal('hide');
          } else {
             alert('Please fill the fields correctly')
          }

      },

      update() {
          let index = this.products.findIndex(el => el.id === this.product.id);

          this.products.splice(index, 1, this.product);

          this.isEdit = false;

         $(this.$refs.vueModal).modal('hide');
      },

      saveOrUpdate() {
          if(this.isEdit) {
             this.update();
          }
          else {
             this.save();
          }
      },

      remove(product) {
          if(confirm("Are you sure about deleting the product?")) {

             let index = this.products.findIndex(el => el.id === product.id);
             this.products.splice(index, 1);
          }
       }
   }
})
