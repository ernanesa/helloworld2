document.addEventListener('DOMContentLoaded', function() {
    // API base URL
    const API_BASE_URL = 'https://cinformonline.com.br/wp-json/wp/v2';
    
    // Current date display
    const currentDateElement = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    currentDateElement.textContent = today.toLocaleDateString('pt-BR', options);
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Load featured posts
    loadFeaturedPosts();
    
    // Load latest posts
    loadLatestPosts();
    
    // Load category posts
    loadCategoryPosts('politica', 'politics-posts');
    loadCategoryPosts('economia', 'economy-posts');
    loadCategoryPosts('esportes', 'sports-posts');
    
    // Load popular posts
    loadPopularPosts();
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    let currentPage = 1;
    
    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        loadLatestPosts(currentPage, true);
    });
    
    // Search functionality
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchPosts(searchTerm);
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchPosts(searchTerm);
            }
        }
    });
    
    // Category links
    const categoryLinks = document.querySelectorAll('.category-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            loadCategoryPage(category);
        });
    });
    
    // Functions to load content
    
    // Load featured posts
    function loadFeaturedPosts() {
        const featuredSlider = document.getElementById('featured-slider');
        
        fetch(`${API_BASE_URL}/posts?_embed&per_page=5&sticky=true`)
            .then(response => response.json())
            .then(posts => {
                if (posts.length === 0) {
                    // If no sticky posts, get latest posts
                    return fetch(`${API_BASE_URL}/posts?_embed&per_page=5`)
                        .then(response => response.json());
                }
                return posts;
            })
            .then(posts => {
                featuredSlider.innerHTML = '';
                
                posts.forEach(post => {
                    const featuredPost = createFeaturedPostElement(post);
                    featuredSlider.appendChild(featuredPost);
                });
            })
            .catch(error => {
                console.error('Error loading featured posts:', error);
                featuredSlider.innerHTML = '<p class="error">Erro ao carregar os destaques. Por favor, tente novamente mais tarde.</p>';
            });
    }
    
    // Load latest posts
    function loadLatestPosts(page = 1, append = false) {
        const latestNewsGrid = document.getElementById('latest-news-grid');
        
        if (!append) {
            latestNewsGrid.innerHTML = '<div class="loading">Carregando notícias...</div>';
        }
        
        fetch(`${API_BASE_URL}/posts?_embed&per_page=9&page=${page}`)
            .then(response => response.json())
            .then(posts => {
                if (!append) {
                    latestNewsGrid.innerHTML = '';
                }
                
                posts.forEach(post => {
                    const newsCard = createNewsCardElement(post);
                    latestNewsGrid.appendChild(newsCard);
                });
                
                // Hide load more button if no more posts
                if (posts.length < 9) {
                    document.getElementById('load-more-btn').style.display = 'none';
                } else {
                    document.getElementById('load-more-btn').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error loading latest posts:', error);
                if (!append) {
                    latestNewsGrid.innerHTML = '<p class="error">Erro ao carregar as notícias. Por favor, tente novamente mais tarde.</p>';
                }
            });
    }
    
    // Load category posts
    function loadCategoryPosts(category, elementId) {
        const categoryPostsElement = document.getElementById(elementId);
        
        fetch(`${API_BASE_URL}/posts?_embed&per_page=5&categories=${getCategoryId(category)}`)
            .then(response => response.json())
            .then(posts => {
                categoryPostsElement.innerHTML = '';
                
                posts.forEach(post => {
                    const categoryPost = createCategoryPostElement(post);
                    categoryPostsElement.appendChild(categoryPost);
                });
            })
            .catch(error => {
                console.error(`Error loading ${category} posts:`, error);
                categoryPostsElement.innerHTML = '<p class="error">Erro ao carregar as notícias. Por favor, tente novamente mais tarde.</p>';
            });
    }
    
    // Load popular posts
    function loadPopularPosts() {
        const popularPostsElement = document.getElementById('popular-posts');
        
        // Using views or comments as popularity metric
        fetch(`${API_BASE_URL}/posts?_embed&per_page=5&orderby=comment_count&order=desc`)
            .then(response => response.json())
            .then(posts => {
                popularPostsElement.innerHTML = '';
                
                posts.forEach(post => {
                    const popularPost = createPopularPostElement(post);
                    popularPostsElement.appendChild(popularPost);
                });
            })
            .catch(error => {
                console.error('Error loading popular posts:', error);
                popularPostsElement.innerHTML = '<p class="error">Erro ao carregar os posts populares. Por favor, tente novamente mais tarde.</p>';
            });
    }
    
    // Search posts
    function searchPosts(searchTerm) {
        const latestNewsGrid = document.getElementById('latest-news-grid');
        const sectionTitle = document.querySelector('.latest-news .section-title');
        
        latestNewsGrid.innerHTML = '<div class="loading">Buscando por "' + searchTerm + '"...</div>';
        sectionTitle.textContent = 'Resultados para "' + searchTerm + '"';
        
        fetch(`${API_BASE_URL}/posts?_embed&search=${searchTerm}`)
            .then(response => response.json())
            .then(posts => {
                latestNewsGrid.innerHTML = '';
                
                if (posts.length === 0) {
                    latestNewsGrid.innerHTML = '<p class="no-results">Nenhum resultado encontrado para "' + searchTerm + '".</p>';
                    return;
                }
                
                posts.forEach(post => {
                    const newsCard = createNewsCardElement(post);
                    latestNewsGrid.appendChild(newsCard);
                });
                
                // Hide load more button for search results
                document.getElementById('load-more-btn').style.display = 'none';
            })
            .catch(error => {
                console.error('Error searching posts:', error);
                latestNewsGrid.innerHTML = '<p class="error">Erro ao buscar. Por favor, tente novamente mais tarde.</p>';
            });
    }
    
    // Load category page
    function loadCategoryPage(category) {
        const latestNewsGrid = document.getElementById('latest-news-grid');
        const sectionTitle = document.querySelector('.latest-news .section-title');
        
        latestNewsGrid.innerHTML = '<div class="loading">Carregando categoria "' + getCategoryName(category) + '"...</div>';
        sectionTitle.textContent = getCategoryName(category);
        
        fetch(`${API_BASE_URL}/posts?_embed&categories=${getCategoryId(category)}&per_page=12`)
            .then(response => response.json())
            .then(posts => {
                latestNewsGrid.innerHTML = '';
                
                if (posts.length === 0) {
                    latestNewsGrid.innerHTML = '<p class="no-results">Nenhuma notícia encontrada nesta categoria.</p>';
                    return;
                }
                
                posts.forEach(post => {
                    const newsCard = createNewsCardElement(post);
                    latestNewsGrid.appendChild(newsCard);
                });
                
                // Hide load more button for category pages
                document.getElementById('load-more-btn').style.display = 'none';
            })
            .catch(error => {
                console.error('Error loading category posts:', error);
                latestNewsGrid.innerHTML = '<p class="error">Erro ao carregar a categoria. Por favor, tente novamente mais tarde.</p>';
            });
    }
    
    // Helper functions to create elements
    
    // Create featured post element
    function createFeaturedPostElement(post) {
        const featuredPost = document.createElement('div');
        featuredPost.className = 'featured-post';
        
        // Get featured image or placeholder
        let imageUrl = 'https://via.placeholder.com/600x400?text=Sem+Imagem';
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
            imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
        }
        
        // Format date
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('pt-BR');
        
        featuredPost.innerHTML = `
            <img src="${imageUrl}" alt="${decodeEntities(post.title.rendered)}">
            <div class="featured-post-content">
                <h3>${decodeEntities(post.title.rendered)}</h3>
                <div class="featured-post-meta">
                    <span>${formattedDate}</span>
                </div>
            </div>
        `;
        
        // Add click event to open post
        featuredPost.addEventListener('click', function() {
            openPostModal(post);
        });
        
        return featuredPost;
    }
    
    // Create news card element
    function createNewsCardElement(post) {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        // Get featured image or placeholder
        let imageUrl = 'https://via.placeholder.com/600x400?text=Sem+Imagem';
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
            imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
        }
        
        // Get category
        let categoryName = 'Notícias';
        let categoryId = '';
        if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] && post._embedded['wp:term'][0][0]) {
            categoryName = post._embedded['wp:term'][0][0].name;
            categoryId = post._embedded['wp:term'][0][0].id;
        }
        
        // Format date
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('pt-BR');
        
        // Create excerpt
        let excerpt = post.excerpt.rendered;
        excerpt = excerpt.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
        excerpt = excerpt.length > 100 ? excerpt.substring(0, 100) + '...' : excerpt;
        
        newsCard.innerHTML = `
            <img src="${imageUrl}" alt="${decodeEntities(post.title.rendered)}">
            <div class="news-card-content">
                <span class="news-card-category">${categoryName}</span>
                <h3>${decodeEntities(post.title.rendered)}</h3>
                <div class="news-card-excerpt">${excerpt}</div>
                <div class="news-card-meta">
                    <span>${formattedDate}</span>
                </div>
            </div>
        `;
        
        // Add click event to open post
        newsCard.addEventListener('click', function() {
            openPostModal(post);
        });
        
        return newsCard;
    }
    
    // Create category post element
    function createCategoryPostElement(post) {
        const categoryPost = document.createElement('div');
        categoryPost.className = 'category-post';
        
        // Get featured image or placeholder
        let imageUrl = 'https://via.placeholder.com/600x400?text=Sem+Imagem';
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
            imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
        }
        
        // Format date
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('pt-BR');
        
        categoryPost.innerHTML = `
            <div class="category-post-img">
                <img src="${imageUrl}" alt="${decodeEntities(post.title.rendered)}">
            </div>
            <div class="category-post-content">
                <h4>${decodeEntities(post.title.rendered)}</h4>
                <div class="category-post-date">${formattedDate}</div>
            </div>
        `;
        
        // Add click event to open post
        categoryPost.addEventListener('click', function() {
            openPostModal(post);
        });
        
        return categoryPost;
    }
    
    // Create popular post element
    function createPopularPostElement(post) {
        const popularPost = document.createElement('div');
        popularPost.className = 'popular-post';
        
        // Get featured image or placeholder
        let imageUrl = 'https://via.placeholder.com/600x400?text=Sem+Imagem';
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
            imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
        }
        
        // Get comment count
        const commentCount = post.comment_count || 0;
        
        popularPost.innerHTML = `
            <div class="popular-post-img">
                <img src="${imageUrl}" alt="${decodeEntities(post.title.rendered)}">
            </div>
            <div class="popular-post-content">
                <h4>${decodeEntities(post.title.rendered)}</h4>
                <div class="popular-post-views">
                    <i class="far fa-comment"></i> ${commentCount} comentários
                </div>
            </div>
        `;
        
        // Add click event to open post
        popularPost.addEventListener('click', function() {
            openPostModal(post);
        });
        
        return popularPost;
    }
    
    // Open post modal
    function openPostModal(post) {
        const modal = document.getElementById('post-modal');
        const modalBody = document.getElementById('modal-body');
        
        // Get featured image or placeholder
        let imageUrl = '';
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
            imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
        }
        
        // Get category
        let categoryName = 'Notícias';
        if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] && post._embedded['wp:term'][0][0]) {
            categoryName = post._embedded['wp:term'][0][0].name;
        }
        
        // Format date
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('pt-BR');
        
        // Get author
        let authorName = 'Redação';
        if (post._embedded && post._embedded.author && post._embedded.author[0]) {
            authorName = post._embedded.author[0].name;
        }
        
        modalBody.innerHTML = `
            <h2 class="modal-post-title">${decodeEntities(post.title.rendered)}</h2>
            <div class="modal-post-meta">
                <span><i class="far fa-user"></i> ${authorName}</span>
                <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                <span><i class="far fa-folder"></i> ${categoryName}</span>
            </div>
            ${imageUrl ? `<img src="${imageUrl}" alt="${decodeEntities(post.title.rendered)}" style="width:100%;">` : ''}
            <div class="modal-post-content">
                ${post.content.rendered}
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Close modal
        const closeModal = document.querySelector('.close-modal');
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Helper function to decode HTML entities
    function decodeEntities(encodedString) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = encodedString;
        return textarea.value;
    }
    
    // Helper function to get category ID
    function getCategoryId(categorySlug) {
        const categories = {
            'noticias': 1,
            'politica': 2,
            'economia': 3,
            'esportes': 4,
            'cultura': 5,
            'entretenimento': 6
        };
        
        return categories[categorySlug] || 1;
    }
    
    // Helper function to get category name
    function getCategoryName(categorySlug) {
        const categories = {
            'noticias': 'Notícias',
            'politica': 'Política',
            'economia': 'Economia',
            'esportes': 'Esportes',
            'cultura': 'Cultura',
            'entretenimento': 'Entretenimento'
        };
        
        return categories[categorySlug] || 'Notícias';
    }
});