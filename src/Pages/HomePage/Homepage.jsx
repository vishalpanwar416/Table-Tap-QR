import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Maincarosel from '../../components/customer/Maincarosel';
import { MenuDropdown, Divider } from '../..//components/customer/MenuDropdown';
import RecommendationItem from '../../components/customer/RecommendationItems';
import CategoryButtons from '../../components/customer/CategoryButtons';
import BestSellers from '../../components/customer/Bestseller';
import Header from '../../components/customer/Header';
import Sidebar from '../../components/customer/Slidebar';
import NotificationSidebar from '../../components/customer/NotificationSlidebar';  
import CartSidebar from '../../components/customer/CartSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../components/customer/CartContent';
import LogoutPopup from '../../components/customer/LogoutPopup';
import { useNavigate } from 'react-router-dom'; 
import DynamicGreeting from '../../components/customer/Greetings';
import LikedItems from '../../components/customer/LikedItems';
import { allFoodItems } from '../../components/foodData';
import {
  profileImg
} from '../../assets/images/Food/Index';

const recommendedItems = allFoodItems.filter(item => 
  item.tags?.some(tag => tag.toLowerCase() === 'recommended')
);

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4, ease: "easeOut" }
};

const staggerItems = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 }
};



export default function HomePage() {
  
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const categoryButtonsRef = useRef(null);
  const { addToCart, cartItems, removeItem, updateQuantity } = useCart();
  const toggleSearch = () => setIsSearchActive(!isSearchActive);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const bestSellerItems = allFoodItems.filter(item => 
    item.tags?.some(tag => tag.toLowerCase() === 'bestseller')
  );
  const handleCategoryClick = (category, event) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    
    setMenuPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left,
      width: buttonRect.width
    });
    
    setActiveCategory(category.name);
    setMenuOpen(true);
  };

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const start = container.scrollLeft;

      container.scrollTo({
        left: start + scrollOffset,
        behavior: 'smooth'
      });
    }
  };
  
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsSidebarOpen(false); 
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsNotificationOpen(false); 
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  const handleCloseMenu = () => setMenuOpen(false);
  return (
    <div className="w-full min-h-screen bg-black"> 
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-black text-white font-spartan-medium min-h-screen max-w-md mx-auto relative overflow-visible flax-col "
    >
      <LogoutPopup 
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          navigate('/home');
          setIsLogoutOpen(false);
          setIsSidebarOpen(false); 
        }}
      />
      {/* Profile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            profileImg={profileImg}
            userName="Vishal Panwar"
            userEmail="Vishalpanwar416@gmail.com"
            onLogout={() => setIsLogoutOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Add NotificationSidebar */}
      <AnimatePresence>
        {isNotificationOpen && (
          <NotificationSidebar 
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        )}
      </AnimatePresence>
      
      
      {/* Header */}
      <Header
        isSearchActive={isSearchActive}
        toggleSearch={toggleSearch}
        toggleSidebar={toggleSidebar}  
        toggleNotifications={toggleNotifications}
        toggleCart={toggleCart}
        cartItems={cartItems}
      />
              
        <motion.div variants={staggerItems} className="flex-1">
        {/* Greeting */}
        <motion.div {...slideUp} className="px-4">
          <DynamicGreeting />
        </motion.div>


        {/* Carousel */}
        <motion.div 
          {...slideUp} 
        >
          <div className="relative pt-3 pb-3 mx-2 my-2">
            <Maincarosel />
          </div>
        </motion.div>
              
        {/* Categories */}
        <motion.div {...slideUp} className="bg-white rounded-t-[30px] rounded-b-none px-6 py-6 pb-2 flex-1 justify-center item-center">
          <CategoryButtons
            activeCategory={activeCategory}
            handleCategoryClick={handleCategoryClick}
            categoryButtonsRef={categoryButtonsRef}
          />

          <AnimatePresence>
            {menuOpen && (
              <MenuDropdown 
              key={activeCategory}
              menuOpen={menuOpen}
              handleCloseMenu={handleCloseMenu}
              menuPosition={menuPosition}
              activeCategory={activeCategory}
              menuItems={allFoodItems.filter(item => item.category === activeCategory)} 
              categoryButtonsRef={categoryButtonsRef}
              onAddToCart={addToCart}
            />
            )}
          </AnimatePresence>

          <Divider />

          {/* Best Sellers */}
          <motion.div variants={staggerItems}>
          <BestSellers foodItems={bestSellerItems} onAddToCart={addToCart} />
          </motion.div>

          <Divider />


          {/* Liked Items */}
          <LikedItems foodItems={allFoodItems}/>


          {/* Recommendations */}
          <motion.div className="px-1 pb-2 text-black flex-1">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-thick font-spartan-bold">Our Best Recommendations</h2>
              <button 
                onClick={() => scroll(scrollRef.current?.clientWidth || 300)}
                className="p-2 rounded-full bg-white text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <motion.div 
              ref={scrollRef}
              className="grid grid-rows-2 grid-flow-col auto-cols-[minmax(45%,1fr)] gap-3 overflow-x-auto scrollbar-hide pb-2"
              variants={staggerItems}
              style={{ 
                scrollSnapType: 'x mandatory',
                minHeight: '320px' 
              }}
            >
              {recommendedItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  id={item.id}
                  variants={itemAnimation}
                  className="h-[160px] w-[160px]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <RecommendationItem 
                    item={item}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
    </div>
  );
}